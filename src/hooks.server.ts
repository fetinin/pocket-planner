import crypto from 'crypto';

import * as Sentry from '@sentry/node';

import type { HandleServerError } from '@sveltejs/kit';
Sentry.init({
	dsn: 'https://73b9898f2f204c3686f16b2651838fa7@o4504547848224769.ingest.sentry.io/4504819016925184',

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0
});

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = crypto.randomUUID();
	// example integration with https://sentry.io/
	Sentry.captureException(error, { extra: { event, errorId } });

	return {
		message: `Whoops! :( Error ID is: ${errorId}`,
		errorId
	};
};
