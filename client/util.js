"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
function GetEmmetConfiguration() {
    const emmetConfig = vscode_1.workspace.getConfiguration('emmet');
    return {
        useNewEmmet: true,
        showExpandedAbbreviation: emmetConfig.showExpandedAbbreviation,
        showAbbreviationSuggestions: emmetConfig.showAbbreviationSuggestions,
        syntaxProfiles: emmetConfig.syntaxProfiles,
        variables: emmetConfig.variables
    };
}
exports.GetEmmetConfiguration = GetEmmetConfiguration;
function NotNull(input) {
    if (!input) {
        return {};
    }
    return input;
}
exports.NotNull = NotNull;
function MatchOffset(regex, data, offset) {
    regex.exec(null);
    let match;
    while ((match = regex.exec(data)) !== null) {
        if (offset > match.index + match[1].length &&
            offset < match.index + match[0].length) {
            return match;
        }
    }
    return null;
}
exports.MatchOffset = MatchOffset;
function Match(regex, data) {
    regex.exec(null);
    let match;
    while ((match = regex.exec(data)) !== null) {
        return match;
    }
    return null;
}
exports.Match = Match;
function GetLanguageRegions(service, data) {
    const scanner = service.createScanner(data);
    const regions = [];
    let tokenType;
    while ((tokenType = scanner.scan()) !== vscode_html_languageservice_1.TokenType.EOS) {
        switch (tokenType) {
            case vscode_html_languageservice_1.TokenType.Styles:
                regions.push({
                    languageId: 'css',
                    start: scanner.getTokenOffset(),
                    end: scanner.getTokenEnd(),
                    length: scanner.getTokenLength(),
                    content: scanner.getTokenText()
                });
                break;
            default:
                break;
        }
    }
    return regions;
}
exports.GetLanguageRegions = GetLanguageRegions;
function GetRegionAtOffset(regions, offset) {
    for (let region of regions) {
        if (region.start <= offset) {
            if (offset <= region.end) {
                return region;
            }
        }
        else {
            break;
        }
    }
    return null;
}
exports.GetRegionAtOffset = GetRegionAtOffset;
function TranslateHTMLTextEdits(input, offset) {
    return input.map((item) => {
        const startPosition = new vscode_1.Position(item.range.start.line + offset, item.range.start.character);
        const endPosition = new vscode_1.Position(item.range.end.line + offset - 1, item.range.end.character);
        const itemRange = new vscode_1.Range(startPosition, endPosition);
        return new vscode_1.TextEdit(itemRange, item.newText);
    });
}
exports.TranslateHTMLTextEdits = TranslateHTMLTextEdits;
function TranslateCompletionItems(items, line, expand = false) {
    return items.map((item) => {
        const result = item;
        const range = new vscode_1.Range(new vscode_1.Position(line.lineNumber, result.textEdit.range.start.character), new vscode_1.Position(line.lineNumber, result.textEdit.range.end.character));
        result.textEdit = null;
        // @ts-ignore - setting range for intellisense to show results properly
        result.range = range;
        if (expand) {
            // i use this to both expand html abbreviations and auto complete tags
            result.command = {
                title: 'Emmet Expand Abbreviation',
                command: 'editor.emmet.action.expandAbbreviation'
            };
        }
        return result;
    });
}
exports.TranslateCompletionItems = TranslateCompletionItems;
function CreateVirtualDocument(
// context: TextDocument | HTMLTextDocument,
languageId, 
// position: Position | HtmlPosition,
content) {
    const doc = vscode_html_languageservice_1.TextDocument.create(`embedded://document.${languageId}`, languageId, 1, content);
    return doc;
}
exports.CreateVirtualDocument = CreateVirtualDocument;
//# sourceMappingURL=util.js.map