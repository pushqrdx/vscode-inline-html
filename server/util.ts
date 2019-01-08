import {
	workspace,
	TextLine,
	Position,
	Range,
	CompletionItem,
	Command
} from 'vscode'

import {
	TextDocument as HtmlTextDocument,
	LanguageService,
	TokenType as HtmlTokenType
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

export function GetLanguageRegions(
	service: LanguageService,
	data: string
): IEmbeddedRegion[] {
	const scanner = service.createScanner(data)
	const regions: IEmbeddedRegion[] = []
	let tokenType: HtmlTokenType

	while ((tokenType = scanner.scan()) !== HtmlTokenType.EOS) {
		switch (tokenType) {
			case HtmlTokenType.Styles:
				regions.push({
					languageId: 'css',
					start: scanner.getTokenOffset(),
					end: scanner.getTokenEnd()
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

export function TranslateCompletionItems(
	items,
	line: TextLine,
	expand: boolean = false
): CompletionItem[] {
	return items.map(item => {
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
	// context: TextDocument | HtmlTextDocument,
	languageId: string,
	// position: Position | HtmlPosition,
	content: string
): HtmlTextDocument {
	const doc = HtmlTextDocument.create(
		`embedded://document.${languageId}`,
		languageId,
		1,
		content
	)

	return doc
}

export interface IEmbeddedRegion {
	languageId: string
	start: number
	end: number
}
