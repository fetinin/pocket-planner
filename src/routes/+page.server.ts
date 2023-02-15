import { pb } from '$lib/store/pb';
import { Collections } from '$lib/store/types';
import { createNewUser, getUserID, logout } from '$lib/user';

import { redirect } from '@sveltejs/kit';

import type {
	RoomsRecord,
	RoomsResponse,
	VotersResponse,
	RoomsVotersRecord,
	RoomsVotersResponse
} from '$lib/store/types';
import type { Actions } from './$types';

export const actions: Actions = {
	createNewRoom: async ({ cookies }) => {
		let userID = getUserID(cookies);

		if (userID) {
			try {
				await pb.collection(Collections.Voters).getOne<VotersResponse>(userID);
			} catch (err) {
				logout(cookies);
				userID = '';
			}
		}

		if (!userID) {
			userID = await createNewUser(cookies);
		}

		const roomNumber = (Math.random() * 10000).toFixed(0);
		const room = await pb
			.collection(Collections.Rooms)
			.create<RoomsResponse>(<RoomsRecord>{ creator_id: userID, public_id: roomNumber });

		await pb.collection(Collections.RoomsVoters).create<RoomsVotersResponse>(<RoomsVotersRecord>{
			room_id: room.id,
			voter_id: userID
		});

		throw redirect(302, `/room/${roomNumber}`);
	}
};
