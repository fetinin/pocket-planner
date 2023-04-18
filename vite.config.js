import { sveltekit } from '@sveltejs/kit/vite';
// import { sentrySvelteKit } from '@sentry/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		// sentrySvelteKit({
    //   sourceMapsUploadOptions: {
    //     org: 'Pocket Planner',
    //     project: '4504818857869312',
    //     authToken: 'xxx',
    //   },
    // }),
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
