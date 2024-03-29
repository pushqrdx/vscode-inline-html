import { languages as Languages, ExtensionContext, commands as Commands, DocumentSelector } from 'vscode'
import { HTMLCompletionItemProvider } from './providers/html'
import { CSSCompletionItemProvider, HTMLStyleCompletionItemProvider } from './providers/css'
import { StyleCompletionItemProvider } from './providers/style'
import { HTMLHoverProvider, CSSHoverProvider, StyleHoverProvider } from './providers/hover'
import { CodeFormatterProvider } from './providers/formatting'

const selector: DocumentSelector = ['typescriptreact', 'javascriptreact', 'typescript', 'javascript']
const triggers = ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export function activate(Context: ExtensionContext) {
	new CodeFormatterProvider()

	Languages.registerHoverProvider(selector, new HTMLHoverProvider())
	Languages.registerHoverProvider(selector, new StyleHoverProvider())
	Languages.registerHoverProvider(selector, new CSSHoverProvider())
	
	Languages.registerCompletionItemProvider(selector, new HTMLCompletionItemProvider(), '<', ...triggers)
	Languages.registerCompletionItemProvider(selector, new HTMLStyleCompletionItemProvider(), ...triggers)
	Languages.registerCompletionItemProvider(selector, new CSSCompletionItemProvider(), ...triggers)
	Languages.registerCompletionItemProvider(selector, new StyleCompletionItemProvider(), ...triggers)
}
