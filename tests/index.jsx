function html()
{
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

			<h3>${['❤️', '💛', '💚', '💙', '💜', '🖤']}</h3>
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

	bug(/*   html*/`
		<div></div>
	`);

	bug(html`
		<div></div>
	`);
}

function bug()
{
	html`div...`;
}

function css()
{
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

	/*    css    */`
		:host {
			display: block;
		}
	`;

	bug(/*css  */`
		:host {
			display: block;
		}
	`)

	bug(css`
		:host {
			display: block;
		}
	`)

	style`
		display: inline;
	`
}