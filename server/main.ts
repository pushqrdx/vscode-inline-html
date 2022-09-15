import { languages as Languages, ExtensionContext, commands as Commands, DocumentSelector } from 'vscode'
import { HTMLCompletionItemProvider } from './providers/html'
import { CSSCompletionItemProvider, HTMLStyleCompletionItemProvider } from './providers/css'
import { HTMLHoverProvider, CSSHoverProvider } from './providers/hover'
import { CodeFormatterProvider } from './providers/formatting'

const selector: DocumentSelector = ['typescriptreact', 'javascriptreact', 'typescript', 'javascript']

export function activate(Context: ExtensionContext) {
	new CodeFormatterProvider()

	Languages.registerCompletionItemProvider(
		selector,
		new HTMLCompletionItemProvider(),
		'<',
		'!',
		'.',
		'}',
		':',
		'*',
		'$',
		']',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9'
	)
	Languages.registerHoverProvider(selector, new HTMLHoverProvider())
	Languages.registerCompletionItemProvider(
		selector,
		new HTMLStyleCompletionItemProvider(),
		'!',
		'.',
		'}',
		':',
		'*',
		'$',
		']',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9'
	)
	Languages.registerHoverProvider(selector, new CSSHoverProvider())
	Languages.registerCompletionItemProvider(
		selector,
		new CSSCompletionItemProvider(),
		'!',
		'.',
		'}',
		':',
		'*',
		'$',
		']',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9'
	)
}
