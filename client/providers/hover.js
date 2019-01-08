"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const util_1 = require("../util");
class HTMLHoverProvider {
    constructor() {
        this._htmlLanguageService = vscode_html_languageservice_1.getLanguageService();
        this._cssLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
        // private _expression = /(html\s*`)([^`]*)(`)/g
        this._expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g;
    }
    provideHover(document, position, token) {
        const currentOffset = document.offsetAt(position);
        const documentText = document.getText();
        const match = util_1.MatchOffset(this._expression, documentText, currentOffset);
        if (!match) {
            return null;
        }
        // tslint:disable-next-line:no-magic-numbers
        const matchContent = match[2];
        const matchStartOffset = match.index + match[1].length;
        const virtualOffset = currentOffset - matchStartOffset;
        const virtualDocument = util_1.CreateVirtualDocument('html', matchContent);
        const html = this._htmlLanguageService.parseHTMLDocument(virtualDocument);
        const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument);
        const hover = this._htmlLanguageService.doHover(virtualDocument, virtualDocument.positionAt(virtualOffset), html) ||
            this._cssLanguageService.doHover(virtualDocument, virtualDocument.positionAt(virtualOffset), stylesheet);
        return hover;
    }
}
exports.HTMLHoverProvider = HTMLHoverProvider;
class CSSHoverProvider {
    constructor() {
        this._htmlLanguageService = vscode_html_languageservice_1.getLanguageService();
        this._cssLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
        this._expression = /(\/\*\s*css\s*\*\/\s*`|css\s*`)([^`]*)(`)/g;
    }
    provideHover(document, position, token) {
        const currentOffset = document.offsetAt(position);
        const documentText = document.getText();
        const match = util_1.MatchOffset(this._expression, documentText, currentOffset);
        if (!match) {
            return null;
        }
        // tslint:disable-next-line:no-magic-numbers
        const matchContent = match[2];
        const matchStartOffset = match.index + match[1].length;
        const virtualOffset = currentOffset - matchStartOffset;
        const virtualDocument = util_1.CreateVirtualDocument('css', matchContent);
        const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument);
        const hover = this._cssLanguageService.doHover(virtualDocument, virtualDocument.positionAt(virtualOffset), stylesheet);
        return hover;
    }
}
exports.CSSHoverProvider = CSSHoverProvider;
//# sourceMappingURL=hover.js.map