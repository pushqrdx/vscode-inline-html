import {
	HoverProvider,
	TextDocument,
	Position,
	CancellationToken,
	Hover
} from 'vscode'

import {
	getLanguageService as GetHtmlLanguageService,
	LanguageService as HtmlLanguageService
} from 'vscode-html-languageservice'

import {
	getCSSLanguageService as GetCssLanguageService,
	LanguageService as CssLanguageService
} from 'vscode-css-languageservice'

import { CreateVirtualDocument, MatchOffset } from '../util'

export class HTMLHoverProvider implements HoverProvider {
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

export class CSSHoverProvider implements HoverProvider {
	private _htmlLanguageService: HtmlLanguageService = GetHtmlLanguageService()
	private _cssLanguageService: CssLanguageService = GetCssLanguageService()
	private _expression = /(\/\*\s*(css|less|scss)\s*\*\/\s*`|css\s*`)([^`]*)(`)/g

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

		const dialect = match[2]

		// tslint:disable-next-line:no-magic-numbers
		const matchContent: string = match[3]
		const matchStartOffset = match.index + match[1].length
		const virtualOffset = currentOffset - matchStartOffset
		const virtualDocument = CreateVirtualDocument(dialect, matchContent)
		const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument)
		const hover =
			this._cssLanguageService.doHover(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				stylesheet
			)

		return hover as Hover
	}
}

export class StyleHoverProvider implements HoverProvider {
	private _htmlLanguageService: HtmlLanguageService = GetHtmlLanguageService()
	private _cssLanguageService: CssLanguageService = GetCssLanguageService()
	private _expression = /(\/\*\s*(style)\s*\*\/\s*`|style\s*`)([^`]*)(`)/g

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

		const dialect = match[2]

		// tslint:disable-next-line:no-magic-numbers
		const matchContent: string = match[3]
		const matchStartOffset = match.index + match[1].length
		const virtualOffset = currentOffset - matchStartOffset + 8
		const virtualDocument = CreateVirtualDocument("css", `:host { ${matchContent} }`)
		const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument)
		const hover =
			this._cssLanguageService.doHover(
				virtualDocument,
				virtualDocument.positionAt(virtualOffset),
				stylesheet
			)

		return hover as Hover
	}
}
