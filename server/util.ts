import {
	workspace,
	TextLine,
	TextEdit,
	Position,
	Range,
	CompletionItem,
	Command
} from 'vscode'

import {
	TextDocument as HTMLTextDocument,
	LanguageService,
	TokenType as HTMLTokenType,
	TextEdit as HTMLTextEdit
} from 'vscode-html-languageservice'

import { EmmetConfiguration } from 'vscode-emmet-helper'

export function GetEmmetConfiguration(): EmmetConfiguration {
	const emmetConfig = workspace.getConfiguration('emmet')
	return {
		useNewEmmet: true,
		showExpandedAbbreviation: emmetConfig.showExpandedAbbreviation,
		showAbbreviationSuggestions: emmetConfig.showAbbreviationSuggestions,
		syntaxProfiles: emmetConfig.syntaxProfiles,
		variables: emmetConfig.variables
	} as EmmetConfiguration
}

export function NotNull<T>(input: any): T {
	if (!input) {
		return {} as T
	}
	return input as T
}

export function MatchOffset(
	regex: RegExp,
	data: string,
	offset: number
): RegExpMatchArray {
	regex.exec(null)

	let match: RegExpExecArray
	while ((match = regex.exec(data)) !== null) {
		if (
			offset > match.index + match[1].length &&
			offset < match.index + match[0].length
		) {
			return match
		}
	}
	return null
}

export function Match(
	regex: RegExp,
	data: string
): RegExpMatchArray {
	regex.exec(null)

	let match: RegExpExecArray
	if ((match = regex.exec(data)) !== null) {
		return match
	}
	return null
}

export function GetLanguageRegions(
	service: LanguageService,
	data: string
): IEmbeddedRegion[] {
	const scanner = service.createScanner(data)
	const regions: IEmbeddedRegion[] = []
	let tokenType: HTMLTokenType
	
	while ((tokenType = scanner.scan()) !== HTMLTokenType.EOS) {
		switch (tokenType) {
			case HTMLTokenType.Styles:
				regions.push({
					languageId: 'css',
					start: scanner.getTokenOffset(),
					end: scanner.getTokenEnd(),
					length: scanner.getTokenLength(),
					content: scanner.getTokenText()
				})
				break
			default:
				break
		}
	}

	return regions
}

export function GetRegionAtOffset(
	regions: IEmbeddedRegion[],
	offset: number
): IEmbeddedRegion {
	for (let region of regions) {
		if (region.start <= offset) {
			if (offset <= region.end) {
				return region
			}
		} else {
			break
		}
	}
	return null
}

export function TranslateHTMLTextEdits(
	input: HTMLTextEdit[],
	offset: number
): TextEdit[] {
	return input.map((item: HTMLTextEdit) => {
		const startPosition = new Position(item.range.start.line + offset, item.range.start.character);
		const endPosition = new Position(item.range.end.line + offset - 1, item.range.end.character);
		const itemRange = new Range(startPosition, endPosition); 
		return new TextEdit(itemRange, item.newText)
	})
}

export function TranslateCompletionItems(
	items,
	line: TextLine,
	expand: boolean = false
): CompletionItem[] {
	return items.map((item: CompletionItem) => {
		const result = item as CompletionItem
		const range = new Range(
			new Position(line.lineNumber, result.textEdit.range.start.character),
			new Position(line.lineNumber, result.textEdit.range.end.character)
		)

		result.textEdit = null

		// @ts-ignore - setting range for intellisense to show results properly
		result.range = range

		if (expand) {
			// i use this to both expand html abbreviations and auto complete tags
			result.command = {
				title: 'Emmet Expand Abbreviation',
				command: 'editor.emmet.action.expandAbbreviation'
			} as Command
		}

		return result
	})
}

export function CreateVirtualDocument(
	// context: TextDocument | HTMLTextDocument,
	languageId: string,
	// position: Position | HtmlPosition,
	content: string
): HTMLTextDocument {
    return HTMLTextDocument.create(
        `embedded://document.${languageId}`,
        languageId,
        1,
        content)
}

export interface IEmbeddedRegion {
	languageId: string
	start: number
	end: number
	length: number
	content: string
}
