import { languages as Languages } from 'vscode'
import { HtmlCompletionItemProvider } from './providers/html'
import { CssCompletionItemProvider } from './providers/css'
import { HtmlHoverProvider } from './providers/hover'

export function activate() {
	Languages.registerCompletionItemProvider(
		['typescript', 'javascript'],
		new HtmlCompletionItemProvider(),
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
	Languages.registerHoverProvider(['typescript', 'javascript'], new HtmlHoverProvider())
	Languages.registerCompletionItemProvider(
		['typescript', 'javascript'],
		new CssCompletionItemProvider(),
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
