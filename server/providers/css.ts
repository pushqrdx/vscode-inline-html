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

import {
	getCSSLanguageService as GetCSSLanguageService,
	LanguageService as CSSLanguageService,
	CompletionList as CSSCompletionList
} from 'vscode-css-languageservice'

import * as emmet from 'vscode-emmet-helper'
import {
	GetEmmetConfiguration,
	MatchOffset,
	CreateVirtualDocument,
	GetLanguageRegions,
	GetRegionAtOffset,
	TranslateCompletionItems
} from '../util'

import { CompletionsCache } from '../cache'

export class HTMLStyleCompletionItemProvider implements CompletionItemProvider {
	private _cssLanguageService: CSSLanguageService = GetCSSLanguageService()
	private _HTMLanguageService: HTMLanguageService = GetHTMLanguageService()
	private _expression = /(\/\*\s*html\s*\*\/\s*`|(?<!`)html\s*`)([^`]*)(`)/gi
	private _cache = new CompletionsCache()

	public provideCompletionItems(
		document: TextDocument,
		position: Position,
		_token: CancellationToken
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
		const regions = GetLanguageRegions(this._HTMLanguageService, matchContent)

		if (regions.length <= 0) {
			return empty
		}

		const region = GetRegionAtOffset(regions, currentOffset - matchStartOffset)

		if (!region) {
			return empty
		}

		const virtualOffset = currentOffset - (matchStartOffset + region.start)
		const virtualDocument = CreateVirtualDocument(
			'css',
			region.content
		)

		const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument)
		const emmetResults: HTMLCompletionList = {
			isIncomplete: true,
			items: []
		}

		this._cssLanguageService.setCompletionParticipants([
			emmet.getEmmetCompletionParticipants(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				'css',
				GetEmmetConfiguration(),
				emmetResults
			)
		])

		const completions = this._cssLanguageService.doComplete(
			virtualDocument,
			virtualDocument.positionAt(virtualOffset),
			stylesheet
		)

		if (emmetResults.items.length) {
			completions.items.push(...emmetResults.items)
			completions.isIncomplete = true
		}

		this._cache.updateCached(document, position, completions as CompletionList)

		return {
			isIncomplete: completions.isIncomplete,
			items: TranslateCompletionItems(completions.items, currentLine)
		} as CompletionList
	}

	public resolveCompletionItem?(
		item: CompletionItem,
		_token: CancellationToken
	): CompletionItem | Thenable<CompletionItem> {
		return item
	}
}

export class CSSCompletionItemProvider implements CompletionItemProvider {
	private _CSSLanguageService: CSSLanguageService = GetCSSLanguageService()
	private _expression = /(\/\*\s*(css|less|scss)\s*\*\/\s*`|(?<!`)(?:css|less|scss)\s*`)([^`]*)(`)/gi
	private _cache = new CompletionsCache()

	public provideCompletionItems(
		document: TextDocument,
		position: Position,
		_token: CancellationToken
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

		const dialect = match[2]

		// tslint:disable-next-line:no-magic-numbers
		const matchContent: string = match[3]
		const matchStartOffset = match.index + match[1].length
		const matchEndOffset = match.index + match[0].length
		const matchPosition = document.positionAt(matchStartOffset)
		const virtualOffset = currentOffset - matchStartOffset
		const virtualDocument = CreateVirtualDocument(dialect, matchContent)
		const vCss = this._CSSLanguageService.parseStylesheet(virtualDocument)
		const emmetResults: CSSCompletionList = {
			isIncomplete: true,
			items: []
		}

		this._CSSLanguageService.setCompletionParticipants([
			emmet.getEmmetCompletionParticipants(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				dialect,
				GetEmmetConfiguration(),
				emmetResults
			)
		])

		const completions = this._CSSLanguageService.doComplete(
			virtualDocument,
			virtualDocument.positionAt(virtualOffset),
			vCss
		)

		if (emmetResults.items.length) {
			completions.items.push(...emmetResults.items)
			completions.isIncomplete = true
		}

		this._cache.updateCached(document, position, completions as CompletionList)

		return {
			isIncomplete: completions.isIncomplete,
			items: TranslateCompletionItems(completions.items, currentLine)
		} as CompletionList
	}

	public resolveCompletionItem?(
		item: CompletionItem,
		_token: CancellationToken
	): CompletionItem | Thenable<CompletionItem> {
		return item
	}
}
