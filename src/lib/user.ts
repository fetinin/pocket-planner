import { pb } from '$lib/store/pb';
import { Collections } from '$lib/store/types';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

import type { VotersRecord, VotersResponse } from '$lib/store/types';
import type { Cookies } from '@sveltejs/kit';
import type { Config } from 'unique-names-generator';

const userCookieName = 'userID';

export async function createNewUser(cookies: Cookies): Promise<string> {
	const user = await pb
		.collection(Collections.Voters)
		.create<VotersResponse>(<VotersRecord>{ nickname: generateName() });

	const userID = user.id.toString();
	cookies.set(userCookieName, userID, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: false,
		maxAge: 60 * 60 * 24 * 30 * 12
	});

	return userID;
}

export function getUserID(cookies: Cookies): string | undefined {
	return cookies.get(userCookieName);
}

export function logout(cookies: Cookies) {
	cookies.delete(userCookieName, { path: '/' });
}

const customConfig: Config = {
	dictionaries: [adjectives, animals],
	separator: ' ',
	length: 2,
	style: 'capital'
};
function generateName(): string {
	return uniqueNamesGenerator(customConfig);
}
