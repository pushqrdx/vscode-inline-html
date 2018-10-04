"use strict";
// Code from https://github.com/Microsoft/typescript-styled-plugin/blob/master/src/styled-template-language-service.ts
Object.defineProperty(exports, "__esModule", { value: true });
class CompletionsCache {
    equalPositions(left, right) {
        return left.line === right.line && left.character === right.character;
    }
    getCached(context, position) {
        if (this._completions &&
            context.fileName === this._cachedCompletionsFile &&
            this._cachedCompletionsPosition &&
            this.equalPositions(position, this._cachedCompletionsPosition) &&
            context.getText() === this._cachedCompletionsContent) {
            return this._completions;
        }
        return undefined;
    }
    updateCached(context, position, completions) {
        this._cachedCompletionsFile = context.fileName;
        this._cachedCompletionsPosition = position;
        this._cachedCompletionsContent = context.getText();
        this._completions = completions;
    }
}
exports.CompletionsCache = CompletionsCache;
//# sourceMappingURL=cache.js.map