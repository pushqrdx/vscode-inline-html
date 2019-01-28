import {
    Range,
    TextDocument,
    WorkspaceEdit,
    workspace as Workspace,
    TextEditor,
    commands as Commands,
    Uri,
    TextEdit,
    Position
} from 'vscode'

import {
    getLanguageService as GetHTMLanguageService, 
    TextDocument as HTMLTextDocument,
    Position as HTMLPosition
} from 'vscode-html-languageservice'

import {
    CreateVirtualDocument,
    TranslateHTMLTextEdits,
    Match,
    GetLanguageRegions,
    IEmbeddedRegion
} from '../util'

export class CodeFormatterProvider {
    private _expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g
    private document: TextDocument;

    constructor() {
        Commands.registerTextEditorCommand('editor.action.formatInlineHtml', this.format, this);
    }

    public format(textEditor: TextEditor) {
        this.document = textEditor.document

        var documentText = this.document.getText()
        var match = Match(this._expression, documentText)

        if (!match) {
            return []
        }

        // TODO - Refactor, This have been used multiple times thourgh out the
        // TODO - extension.
        var matchStartOffset = match.index + match[1].length
        var matchEndOffset = match.index + (match[2].length + match[3].length + 1)
        var matchStartPosition = this.document.positionAt(matchStartOffset)
        var matchEndPosition = this.document.positionAt(matchEndOffset)

        var text = this.document.getText(new Range(matchStartPosition, matchEndPosition))
        var vHTML = CreateVirtualDocument('html', text)
       
        // TODO - Expose Formatting Options
        const edits = TranslateHTMLTextEdits(
            GetHTMLanguageService().format(vHTML, null, {
                indentInnerHtml: false,
                preserveNewLines: true,
                tabSize: <number>textEditor.options.tabSize,
                insertSpaces: <boolean>textEditor.options.insertSpaces,
                endWithNewline: true
            }),
            matchStartPosition.line + 1)
        
        Workspace.applyEdit(this.composeEdits(this.document.uri, edits))
    }

    private composeEdits(uri: Uri, edits: TextEdit[]): WorkspaceEdit {
        var ws = new WorkspaceEdit()
        ws.set(uri, edits)
        return ws
    }
}

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