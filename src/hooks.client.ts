import * as Sentry from '@sentry/sveltekit';

import type { HandleClientError } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://9499d6f0d9204e50ab3e46b133a53e4f@o4504547848224769.ingest.sentry.io/4504818857869312',
	tracesSampleRate: 1.0,
	// For instance, initialize Session Replay:
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	integrations: [new Sentry.Replay()]
});

export const myErrorHandler: HandleClientError = ({ error, event }) => {
	console.error('An error occurred on the client side:', error, event);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
