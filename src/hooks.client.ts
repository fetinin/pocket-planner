import * as SentrySvelte from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';

import type { HandleClientError } from '@sveltejs/kit';

// Initialize the Sentry SDK here
SentrySvelte.init({
	dsn: 'https://9499d6f0d9204e50ab3e46b133a53e4f@o4504547848224769.ingest.sentry.io/4504818857869312',
	integrations: [new BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0
});

SentrySvelte.setTag('svelteKit', 'browser');

export const handleError: HandleClientError = ({ error, event }) => {
	const errorId = crypto.randomUUID();
	// example integration with https://sentry.io/
	SentrySvelte.captureException(error, { contexts: { sveltekit: { event } }, extra: { errorId } });

	return {
		message: `Whoops! :( Error ID is: ${errorId}`,
		errorId
	};
};