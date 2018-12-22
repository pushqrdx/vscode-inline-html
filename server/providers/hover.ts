import {
	HoverProvider,
	TextDocument,
	Position,
	CancellationToken,
	Hover
} from 'vscode'

import {
	getLanguageService as GetHtmlLanguageService,
	LanguageService as HtmlLanguageService,
	CompletionList as HtmlCompletionList
} from 'vscode-html-languageservice'

import {
	getCSSLanguageService as GetCssLanguageService,
	LanguageService as CssLanguageService
} from 'vscode-css-languageservice'

import { CreateVirtualDocument, MatchOffset } from '../util'

export class HtmlHoverProvider implements HoverProvider {
	private _htmlLanguageService: HtmlLanguageService = GetHtmlLanguageService()
	private _cssLanguageService: CssLanguageService = GetCssLanguageService()
	// private _expression = /(html\s*`)([^`]*)(`)/g
	private _expression =  /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g


	provideHover(
		document: TextDocument,
		position: Position,
		token: CancellationToken
	): Hover {
		const currentOffset = document.offsetAt(position)
		const documentText = document.getText()
		const match = MatchOffset(this._expression, documentText, currentOffset)

		if (!match) {
			return null
		}

		// tslint:disable-next-line:no-magic-numbers
		const matchContent: string = match[2]
		const matchStartOffset = match.index + match[1].length
		const virtualOffset = currentOffset - matchStartOffset
		const virtualDocument = CreateVirtualDocument('html', matchContent)
		const html = this._htmlLanguageService.parseHTMLDocument(virtualDocument)
		const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument)
		const hover =
			this._htmlLanguageService.doHover(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				html
			) ||
			this._cssLanguageService.doHover(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				stylesheet
			)

		return hover as Hover
	}
}
