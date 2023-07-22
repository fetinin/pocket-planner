import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from "@sentry/sveltekit";

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sentrySvelteKit({
			adapter: 'vercel',
			autoInstrument: false,
      sourceMapsUploadOptions: {
        org: "pocket-planner",
        project: "pocket-planner",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: "https://sentry.io/",
        cleanArtifacts: true,
        rewrite: false,
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
