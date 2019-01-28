"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const util_1 = require("../util");
class CodeFormatterProvider {
    constructor() {
        this._expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g;
        vscode_1.commands.registerTextEditorCommand('editor.action.formatInlineHtml', this.format, this);
    }
    format(textEditor) {
        this.document = textEditor.document;
        var documentText = this.document.getText();
        var match = util_1.Match(this._expression, documentText);
        if (!match) {
            return [];
        }
        // TODO - Refactor, This have been used multiple times thourgh out the
        // TODO - extension.
        var matchStartOffset = match.index + match[1].length;
        var matchEndOffset = match.index + (match[2].length + match[3].length + 1);
        var matchStartPosition = this.document.positionAt(matchStartOffset);
        var matchEndPosition = this.document.positionAt(matchEndOffset);
        var text = this.document.getText(new vscode_1.Range(matchStartPosition, matchEndPosition));
        var vHTML = util_1.CreateVirtualDocument('html', text);
        // TODO - Expose Formatting Options
        const edits = util_1.TranslateHTMLTextEdits(vscode_html_languageservice_1.getLanguageService().format(vHTML, null, {
            indentInnerHtml: false,
            preserveNewLines: true,
            tabSize: textEditor.options.tabSize,
            insertSpaces: textEditor.options.insertSpaces,
            endWithNewline: true
        }), matchStartPosition.line + 1);
        vscode_1.workspace.applyEdit(this.composeEdits(this.document.uri, edits));
    }
    composeEdits(uri, edits) {
        var ws = new vscode_1.WorkspaceEdit();
        ws.set(uri, edits);
        return ws;
    }
}
exports.CodeFormatterProvider = CodeFormatterProvider;
/*
var dd:HTMLTextDocument[] = [];
var stylesRegions = GetLanguageRegions(GetHTMLanguageService(), text)

stylesRegions.map(x => {
    let cssRegion = x;
    let cssRegionTagStart = vHTML.positionAt(cssRegion.start)
    let cssRegionTagEnd = vHTML.positionAt(cssRegion.end)

    // Accommodate for tag start position
    cssRegionTagStart.line = cssRegionTagStart.line - 1
    // Accommodate for tag end position
    cssRegionTagEnd.line = cssRegionTagEnd.line + 1

    let cssTag = vHTML.getText(new Range(new Position(cssRegionTagStart.line, cssRegionTagStart.character), new Position(cssRegionTagEnd.line, cssRegionTagEnd.character)))

    dd.push(CreateVirtualDocument('css', cssTag))

    text = text.replace(cssTag, '')

    console.log(text)
})

var newOffset = vHTML.
vHTML = CreateVirtualDocument('html', text)

*/ 
//# sourceMappingURL=formatting.js.map