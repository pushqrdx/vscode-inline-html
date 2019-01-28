import { languages as Languages } from 'vscode'
import { HTMLCompletionItemProvider } from './providers/html'
import { CSSCompletionItemProvider, HTMLStyleCompletionItemProvider } from './providers/css'
import { HTMLHoverProvider, CSSHoverProvider } from './providers/hover'
import { InlineFormattingProvider } from './providers/formatting'

export function activate() {
	//Languages.registerDocumentRangeFormattingEditProvider(['typescript', 'javascript'], new InlineFormattingProvider())
	Languages.registerCompletionItemProvider(
		['typescript', 'javascript'],
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
	Languages.registerHoverProvider(['typescript', 'javascript'], new HTMLHoverProvider())
	Languages.registerCompletionItemProvider(
		['typescript', 'javascript'],
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
	Languages.registerHoverProvider(['typescript', 'javascript'], new CSSHoverProvider())
	Languages.registerCompletionItemProvider(
		['typescript', 'javascript'],
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
