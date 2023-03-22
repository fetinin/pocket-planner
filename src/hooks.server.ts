import crypto from 'crypto';

import * as SentryNode from '@sentry/node';

import type { HandleServerError } from '@sveltejs/kit';
SentryNode.init({
	dsn: 'https://73b9898f2f204c3686f16b2651838fa7@o4504547848224769.ingest.sentry.io/4504819016925184',

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
	integrations: [new SentryNode.Integrations.Http()]
});

SentryNode.setTag('svelteKit', 'server');

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = crypto.randomUUID();
	// example integration with https://sentry.io/
	SentryNode.captureException(error, { contexts: { sveltekit: { event } }, extra: { errorId } });

	return {
		message: `Whoops! :( Error ID is: ${errorId}`,
		errorId
	};
};
