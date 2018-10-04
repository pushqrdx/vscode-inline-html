// Code from https://github.com/Microsoft/typescript-styled-plugin/blob/master/src/styled-template-language-service.ts

import { CompletionList, TextDocument, Position } from 'vscode'

export class CompletionsCache {
	private _cachedCompletionsFile?: string
	private _cachedCompletionsPosition?: Position
	private _cachedCompletionsContent?: string
	private _completions?: CompletionList

	private equalPositions(left: Position, right: Position): boolean {
		return left.line === right.line && left.character === right.character
	}

	public getCached(
		context: TextDocument,
		position: Position
	): CompletionList | undefined {
		if (
			this._completions &&
			context.fileName === this._cachedCompletionsFile &&
			this._cachedCompletionsPosition &&
			this.equalPositions(position, this._cachedCompletionsPosition) &&
			context.getText() === this._cachedCompletionsContent
		) {
			return this._completions
		}

		return undefined
	}

	public updateCached(
		context: TextDocument,
		position: Position,
		completions: CompletionList
	) {
		this._cachedCompletionsFile = context.fileName
		this._cachedCompletionsPosition = position
		this._cachedCompletionsContent = context.getText()
		this._completions = completions
	}
}
