"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const html_1 = require("./providers/html");
const css_1 = require("./providers/css");
const style_1 = require("./providers/style");
const hover_1 = require("./providers/hover");
const formatting_1 = require("./providers/formatting");
const selector = ['typescriptreact', 'javascriptreact', 'typescript', 'javascript'];
const triggers = ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function activate(Context) {
    new formatting_1.CodeFormatterProvider();
    vscode_1.languages.registerHoverProvider(selector, new hover_1.HTMLHoverProvider());
    vscode_1.languages.registerHoverProvider(selector, new hover_1.StyleHoverProvider());
    vscode_1.languages.registerHoverProvider(selector, new hover_1.CSSHoverProvider());
    vscode_1.languages.registerCompletionItemProvider(selector, new html_1.HTMLCompletionItemProvider(), '<', ...triggers);
    vscode_1.languages.registerCompletionItemProvider(selector, new css_1.HTMLStyleCompletionItemProvider(), ...triggers);
    vscode_1.languages.registerCompletionItemProvider(selector, new css_1.CSSCompletionItemProvider(), ...triggers);
    vscode_1.languages.registerCompletionItemProvider(selector, new style_1.StyleCompletionItemProvider(), ...triggers);
}
exports.activate = activate;
//# sourceMappingURL=main.js.map