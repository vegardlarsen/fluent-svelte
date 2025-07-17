import path from "path";
import preprocess from "svelte-preprocess";
import vercel from "@sveltejs/adapter-vercel";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import prefixer from "postcss-variables-prefixer";

import a11yEmoji from "@fec/remark-a11y-emoji";
import slug from "rehype-slug";
import github from "remark-github";
import examples from "mdsvexamples";

// import sveld from "vite-plugin-sveld";

import { mdsvex } from "mdsvex";
import Prism from "prismjs";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-scss.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-regex.js";
import "prism-svelte";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	extensions: [".svelte", ".md", ".svx"],
	preprocess: [
		mdsvex({
			extensions: [".svx", ".md"],
			remarkPlugins: [
				github,
				a11yEmoji,
				[
					examples,
					{
						defaults: {
							Wrapper: "/src/site/lib/Example/Example.svelte"
						}
					}
				]
			],
			rehypePlugins: [slug]
		}),
		preprocess({
			postcss: {
				plugins: [autoprefixer(), cssnano(), prefixer({ prefix: "fds-" })]
			},
			scss: {
				silenceDeprecations: ['legacy-js-api']
			}
		})
	],
	compilerOptions: {
		// Enable compatibility mode for Svelte 5 with Svelte 4 syntax
		compatibility: {
			componentApi: 4
		}
	},
	kit: {
		adapter: vercel()
	}
};

export default config;
