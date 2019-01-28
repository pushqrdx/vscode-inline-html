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
        this._expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g;
        this._cache = new cache_1.CompletionsCache();
    }
    provideCompletionItems(document, position, _token) {
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
        const match = util_1.MatchOffset(this._expression, documentText, currentOffset);
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
        const virtualDocument = util_1.CreateVirtualDocument('css', region.content);
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
    resolveCompletionItem(item, _token) {
        return item;
    }
}
exports.HTMLStyleCompletionItemProvider = HTMLStyleCompletionItemProvider;
class CSSCompletionItemProvider {
    constructor() {
        this._CSSLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
        this._expression = /(\/\*\s*css\s*\*\/\s*`|css\s*`)([^`]*)(`)/g;
        this._cache = new cache_1.CompletionsCache();
    }
    provideCompletionItems(document, position, _token) {
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
        const virtualDocument = util_1.CreateVirtualDocument('css', matchContent);
        const vCss = this._CSSLanguageService.parseStylesheet(virtualDocument);
        const emmetResults = {
            isIncomplete: true,
            items: []
        };
        this._CSSLanguageService.setCompletionParticipants([
            emmet.getEmmetCompletionParticipants(virtualDocument, virtualDocument.positionAt(virtualOffset), 'css', util_1.GetEmmetConfiguration(), emmetResults)
        ]);
        const completions = this._CSSLanguageService.doComplete(virtualDocument, virtualDocument.positionAt(virtualOffset), vCss);
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
    resolveCompletionItem(item, _token) {
        return item;
    }
}
exports.CSSCompletionItemProvider = CSSCompletionItemProvider;
//# sourceMappingURL=css.js.map