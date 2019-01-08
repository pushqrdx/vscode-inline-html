"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const util_1 = require("../util");
class InlineFormattingProvider {
    constructor() {
        this._HTMLanguageService = vscode_html_languageservice_1.getLanguageService();
        this._expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g;
    }
    provideDocumentRangeFormattingEdits(document, range, options, _token) {
        const documentText = document.getText();
        const match = util_1.MatchOffset(this._expression, documentText, document.offsetAt(range.end));
        if (!match) {
            return [];
        }
        return util_1.TranslateHTMLTextEdits(vscode_html_languageservice_1.getLanguageService().format(util_1.CreateVirtualDocument('html', document.getText()), range, {
            indentInnerHtml: false
        }));
    }
}
exports.InlineFormattingProvider = InlineFormattingProvider;
//# sourceMappingURL=formatting.js.map