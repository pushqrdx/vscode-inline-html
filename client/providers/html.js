"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const emmet = require("vscode-emmet-helper");
const util_1 = require("../util");
const cache_1 = require("../cache");
class HtmlCompletionItemProvider {
    constructor() {
        this._htmlLanguageService = vscode_html_languageservice_1.getLanguageService();
        this._expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g;
        // private _expression = /(html\s*`)([^`]*)(`)/g
        this._cache = new cache_1.CompletionsCache();
    }
    provideCompletionItems(document, position, token) {
        const cached = this._cache.getCached(document, position);
        if (cached) {
            return cached;
        }
        const empty = {
            isIncomplete: false,
            items: []
        };
        const currentLine = document.lineAt(position.line);
        if (currentLine.isEmptyOrWhitespace) {
            return empty;
        }
        const currentLineText = currentLine.text.trim();
        const currentOffset = document.offsetAt(position);
        const documentText = document.getText();
        const match = util_1.MatchOffset(this._expression, documentText, currentOffset);
        if (!match) {
            return empty;
        }
        // tslint:disable-next-line:no-magic-numbers
        const matchContent = match[2];
        const matchStartOffset = match.index + match[1].length;
        const matchEndOffset = match.index + match[0].length;
        const matchPosition = document.positionAt(matchStartOffset);
        const virtualOffset = currentOffset - matchStartOffset;
        const virtualDocument = util_1.CreateVirtualDocument('html', matchContent);
        const vHtml = this._htmlLanguageService.parseHTMLDocument(virtualDocument);
        const emmetResults = {
            isIncomplete: true,
            items: []
        };
        this._htmlLanguageService.setCompletionParticipants([
            emmet.getEmmetCompletionParticipants(virtualDocument, virtualDocument.positionAt(virtualOffset), 'html', util_1.GetEmmetConfiguration(), emmetResults)
        ]);
        const completions = this._htmlLanguageService.doComplete(virtualDocument, virtualDocument.positionAt(virtualOffset), vHtml);
        if (emmetResults.items.length) {
            completions.items.push(...emmetResults.items);
            completions.isIncomplete = true;
        }
        this._cache.updateCached(document, position, completions);
        return {
            isIncomplete: completions.isIncomplete,
            items: util_1.TranslateCompletionItems(completions.items, currentLine, true)
        };
    }
    resolveCompletionItem(item, token) {
        return item;
    }
}
exports.HtmlCompletionItemProvider = HtmlCompletionItemProvider;
//# sourceMappingURL=html.js.map