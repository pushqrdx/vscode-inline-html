import {
	CompletionList,
	CompletionItem,
	TextDocument,
	Position,
	CancellationToken,
	CompletionItemProvider
} from 'vscode'

import {
	getLanguageService as GetHTMLanguageService,
	LanguageService as HTMLanguageService,
	CompletionList as HTMLCompletionList
} from 'vscode-html-languageservice'

import * as emmet from 'vscode-emmet-helper'

import {
	GetEmmetConfiguration,
	MatchOffset,
	CreateVirtualDocument,
	TranslateCompletionItems
} from '../util'

import { CompletionsCache } from '../cache'

export class HTMLCompletionItemProvider implements CompletionItemProvider {
	private _htmlLanguageService: HTMLanguageService = GetHTMLanguageService()
	private _expression =  /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g
	// private _expression = /(html\s*`)([^`]*)(`)/g
	private _cache = new CompletionsCache()

	public provideCompletionItems(
		document: TextDocument,
		position: Position,
		token: CancellationToken
	): CompletionList {
		const cached = this._cache.getCached(document, position)

		if (cached) {
			return cached
		}

		const currentLine = document.lineAt(position.line)
		const empty = {
			isIncomplete: false,
			items: []
		} as CompletionList

		if (currentLine.isEmptyOrWhitespace) {
			return empty
		}

		const currentLineText = currentLine.text.trim()
		const currentOffset = document.offsetAt(position)
		const documentText = document.getText()
		const match = MatchOffset(this._expression, documentText, currentOffset)

		if (!match) {
			return empty
		}

		// tslint:disable-next-line:no-magic-numbers
		const matchContent: string = match[2]
		const matchStartOffset = match.index + match[1].length
		const matchEndOffset = match.index + match[0].length
		const matchPosition = document.positionAt(matchStartOffset)
		const virtualOffset = currentOffset - matchStartOffset
		const virtualDocument = CreateVirtualDocument('html', matchContent)
		const vHtml = this._htmlLanguageService.parseHTMLDocument(virtualDocument)
		const emmetResults: HTMLCompletionList = {
			isIncomplete: true,
			items: []
		}

		this._htmlLanguageService.setCompletionParticipants([
			emmet.getEmmetCompletionParticipants(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				'html',
				GetEmmetConfiguration(),
				emmetResults
			)
		])

		const completions = this._htmlLanguageService.doComplete(
			virtualDocument,
			virtualDocument.positionAt(virtualOffset),
			vHtml
		)

		if (emmetResults.items.length) {
			completions.items.push(...emmetResults.items)
			completions.isIncomplete = true
		}

		this._cache.updateCached(document, position, completions as CompletionList)

		return {
			isIncomplete: completions.isIncomplete,
			items: TranslateCompletionItems(completions.items, currentLine, true)
		} as CompletionList
	}

	public resolveCompletionItem?(
		item: CompletionItem,
		token: CancellationToken
	): CompletionItem | Thenable<CompletionItem> {
		return item
	}
}
