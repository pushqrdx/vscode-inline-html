// @ts-ignore

html()
{
	// @ts-ignore

	html`
		<style>
			:host {
				display: block;
			}
		</style>

		<body>
			<input type="button" @click=${(e) => this.click(e)} value="deadmau5 🐭" />
		
			<div></div>
			<div></div>
			<div></div>
		
			<h3>${ ['❤️', '💛', '💚', '💙', '💜', '🖤']}</h3>
		</body>
	`;

	/* html */`
		<div></div>
		<div></div>
		<div></div>
		<div></div>
		<div>
			<p></p>
		</div>
	`;
}

// @ts-ignore

bug()
{
	// @ts-ignore

	html`div...`;
}

// @ts-ignore

css()
{
	// @ts-ignore

	css`
		:host {
			display: block;
		}
	`;

	/* css */`
		:host {
			display: block;
			height: 50px;
		}
	`;

	// MORE SPACES
	/*    css    */`
		:host {
			display: block;
		}
	`;
}