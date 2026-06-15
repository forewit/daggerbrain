import { sentrySvelteKit } from '@sentry/sveltekit';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: '<your-sentry-org>',
			project: '<your-sentry-project>'
		}),
		tailwindcss(),
		enhancedImages(),
		sveltekit()
	]
});
