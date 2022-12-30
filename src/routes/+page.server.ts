import { pb } from '$lib/store/pb';
import { Collections } from '$lib/store/types';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

import { redirect } from '@sveltejs/kit';

import type {
	RoomsRecord,
	RoomsResponse,
	VotersRecord,
	VotersResponse,
	RoomsVotersRecord,
	RoomsVotersResponse
} from '$lib/store/types';
import type { Actions } from './$types';
import type { Config } from 'unique-names-generator';

export const actions: Actions = {
	createNewRoom: async ({ cookies, locals }) => {
		let userID = cookies.get('userID');
		if (!userID) {
			const user = await pb
				.collection(Collections.Voters)
				.create<VotersResponse>(<VotersRecord>{ nickname: generateName() });
			userID = user.id.toString();

			cookies.set('userID', userID, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: false,
				maxAge: 60 * 60 * 24 * 30
			});
		}

		const roomNumber = (Math.random() * 10000).toFixed(0);
		const room = await pb
			.collection(Collections.Rooms)
			.create<RoomsResponse>(<RoomsRecord>{ creator_id: userID, public_id: roomNumber });
		await pb.collection(Collections.RoomsVoters).create<RoomsVotersResponse>(<RoomsVotersRecord>{
			room_id: room.id,
			voter_id: cookies.get('userID')
		});

		throw redirect(303, `/room/${roomNumber}`);
	}
};

const customConfig: Config = {
	dictionaries: [adjectives, animals],
	separator: ' ',
	length: 2,
	style: 'capital'
};
function generateName(): string {
	return uniqueNamesGenerator(customConfig);
}
