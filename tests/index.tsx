// @ts-nocheck

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
    		font-size: var(--body-font-size, 14px);
		}
	`)

	scss`
		:root {
			background-image: linear-gradient(to right, #33ccff, #ff99cc);

			:host {
				display: block;
			}
		}
	`

    /*less*/`
        :host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
        }
    `

	/*style*/`
		display: table-cell;
		word-wrap: anywhere;
		overflow: visible;
		font-size: 12px;
		white-space: pre;
		color: black;
		border-spacing: 0ch;
	`
}