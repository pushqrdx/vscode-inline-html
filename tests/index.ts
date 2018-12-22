import {
	CustomElement,
	ExtendedHTMLElement,
	html,
	Property
} from './void/extended-element';

@CustomElement('child-component')
class ChildComponent extends ExtendedHTMLElement {
	@Property({ observed: true, attribute: 'child-stars' })
	stars: number = 0;

	@Property({ private: true })
	private: number = 5;

	@Property() 
	hearts: string[] = ['❤️', '💛', '💚', '💙', '💜', '🖤'];

	template() {
		return html`
			<style>
                :host {
                    display: block;
                }
			</style>

			<input type="button" @click=${(e)=>this.clickMe(e)} value="Click me" />
			
            <h3>${this.stars}</h3>
        `;
	}

	bug() {
		return html`div...`;
	}
}
