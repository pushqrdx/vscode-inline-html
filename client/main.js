"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const html_1 = require("./providers/html");
const css_1 = require("./providers/css");
const hover_1 = require("./providers/hover");
function activate() {
    vscode_1.languages.registerCompletionItemProvider(['typescript', 'javascript'], new html_1.HtmlCompletionItemProvider(), '<', '!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    vscode_1.languages.registerHoverProvider(['typescript', 'javascript'], new hover_1.HtmlHoverProvider());
    vscode_1.languages.registerCompletionItemProvider(['typescript', 'javascript'], new css_1.CssCompletionItemProvider(), '!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
}
exports.activate = activate;
//# sourceMappingURL=main.js.map