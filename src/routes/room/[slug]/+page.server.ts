import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	if (!params.slug || !isNumber(params.slug)) {
		throw error(404, {
			message: 'Not found'
		});
	}

	return {};
}) satisfies PageServerLoad;

function isNumber(val: string): boolean {
	return /^-?\d+$/.test(val)
}
