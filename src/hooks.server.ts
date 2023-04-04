import * as Sentry from '@sentry/sveltekit';

import type { HandleServerError } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://73b9898f2f204c3686f16b2651838fa7@o4504547848224769.ingest.sentry.io/4504819016925184',
	tracesSampleRate: 1.0
});

const myErrorHandler: HandleServerError = ({ error, event }) => {
	console.error('An error occurred on the server side:', error, event);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
