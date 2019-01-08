"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const emmet = require("vscode-emmet-helper");
const util_1 = require("../util");
const cache_1 = require("../cache");
class HTMLStyleCompletionItemProvider {
    constructor() {
        this._cssLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
        this._HTMLanguageService = vscode_html_languageservice_1.getLanguageService();
        this._htmlExpression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g;
        this._cache = new cache_1.CompletionsCache();
    }
    provideCompletionItems(document, position, token) {
        const cached = this._cache.getCached(document, position);
        if (cached) {
            return cached;
        }
        const currentLine = document.lineAt(position.line);
        const empty = {
            isIncomplete: false,
            items: []
        };
        if (currentLine.isEmptyOrWhitespace) {
            return empty;
        }
        const currentLineText = currentLine.text.trim();
        const currentOffset = document.offsetAt(position);
        const documentText = document.getText();
        const match = util_1.MatchOffset(this._htmlExpression, documentText, currentOffset);
        if (!match) {
            return empty;
        }
        // tslint:disable-next-line:no-magic-numbers
        const matchContent = match[2];
        const matchStartOffset = match.index + match[1].length;
        const matchEndOffset = match.index + match[0].length;
        const regions = util_1.GetLanguageRegions(this._HTMLanguageService, matchContent);
        if (regions.length <= 0) {
            return empty;
        }
        const region = util_1.GetRegionAtOffset(regions, currentOffset - matchStartOffset);
        if (!region) {
            return empty;
        }
        const virtualOffset = currentOffset - (matchStartOffset + region.start);
        const virtualDocument = util_1.CreateVirtualDocument('css', matchContent.slice(region.start, region.end));
        const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument);
        const emmetResults = {
            isIncomplete: true,
            items: []
        };
        this._cssLanguageService.setCompletionParticipants([
            emmet.getEmmetCompletionParticipants(virtualDocument, virtualDocument.positionAt(virtualOffset), 'css', util_1.GetEmmetConfiguration(), emmetResults)
        ]);
        const completions = this._cssLanguageService.doComplete(virtualDocument, virtualDocument.positionAt(virtualOffset), stylesheet);
        if (emmetResults.items.length) {
            completions.items.push(...emmetResults.items);
            completions.isIncomplete = true;
        }
        this._cache.updateCached(document, position, completions);
        return {
            isIncomplete: completions.isIncomplete,
            items: util_1.TranslateCompletionItems(completions.items, currentLine)
        };
    }
    resolveCompletionItem(item, token) {
        return item;
    }
}
exports.HTMLStyleCompletionItemProvider = HTMLStyleCompletionItemProvider;
//# sourceMappingURL=style.js.map