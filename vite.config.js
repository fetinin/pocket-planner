import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'Pocket Planner',
        project: 'javascript-svelte',
        authToken: 'https://9499d6f0d9204e50ab3e46b133a53e4f@o4504547848224769.ingest.sentry.io/4504818857869312',
      },
    }),
		sveltekit()
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	}
};

export default config;
