import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [mdsvex(), vitePreprocess()],
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@convex': './src/convex'
		},
		experimental: {
			remoteFunctions: true,

			tracing: {
				server: true
			},

			instrumentation: {
				server: true
			}
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
