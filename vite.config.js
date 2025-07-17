import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import examplesVite from 'mdsvexamples/vite';

export default defineConfig({
	plugins: [sveltekit(), examplesVite],
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.svg'],
		alias: {
			$site: path.resolve('src/site'),
			'fluent-svelte': path.resolve('src/lib')
		}
	}
});