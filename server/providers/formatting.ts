import {
    Range,
    TextEdit,
    TextDocument,
    FormattingOptions,
    CancellationToken,
    DocumentRangeFormattingEditProvider
} from 'vscode'

import {
    getLanguageService as GetHTMLanguageService,
    LanguageService as HTMLanguageService,
    Position
} from 'vscode-html-languageservice'

import {
    CreateVirtualDocument,
    TranslateHTMLTextEdits,
    MatchOffset
} from '../util'

export class InlineFormattingProvider implements DocumentRangeFormattingEditProvider {
    private _HTMLanguageService: HTMLanguageService = GetHTMLanguageService()
    private _expression = /(\/\*\s*html\s*\*\/\s*`|html\s*`)([^`]*)(`)/g

    provideDocumentRangeFormattingEdits(
        document: TextDocument,
        range: Range,
        options: FormattingOptions,
        _token: CancellationToken): TextEdit[] | Thenable<TextEdit[]> {
        const documentText = document.getText()
        const match = MatchOffset(this._expression, documentText, document.offsetAt(range.end))

        if (!match) {
            return []
        }

        // ! Fix - exclude <style> tags from formatting because it get's messed up  

        return TranslateHTMLTextEdits(GetHTMLanguageService().format(CreateVirtualDocument('html', document.getText()), range, {
            indentInnerHtml: false
        }));
    }
}