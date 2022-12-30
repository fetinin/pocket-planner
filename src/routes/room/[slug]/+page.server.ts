import { pb } from '$lib/store/pb';

import { error, redirect } from '@sveltejs/kit';

import type { User } from '$lib/store/pb';

import type { PageServerLoad } from './$types';

type Voter = {
	id: string;
	nickname: string;
	voted: boolean;
};

export const load = (async ({ params, cookies, locals }) => {
	if (!params.slug || !isNumber(params.slug)) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const userID = cookies.get('userID') || '';
	if (!userID) {
		throw redirect(303, `/`);
	}

	try {
		var user = await pb.collection('voters').getOne<User>(userID);
	} catch (err) {
		console.log('no voters found');
		console.log(err);
		cookies.delete('userID');
		throw redirect(303, `/`);
	}

	try {
		var room = await pb.collection('rooms').getFirstListItem(`public_id = '${params.slug}'`);
	} catch {
		throw error(404, {
			message: 'Room not found'
		});
	}

	const roomsVotersRecords = await pb
		.collection('rooms_voters')
		.getFullList(50, { filter: `room_id='${room.id}'`, expand: 'voter_id' });

	let voters: Voter[] = roomsVotersRecords.map((r) => {
		return { id: r.voter_id, voted: false, nickname: r.expand.voter_id.nickname };
	});

	const roomHasCurrentUser = roomsVotersRecords.some((r) => r.voter_id === user.id);
	if (!roomHasCurrentUser) {
		await pb.collection('rooms_voters').create({ room_id: room.id, voter_id: user.id });
		console.log('user addet to room');
		voters = [{ id: user.id, voted: false, nickname: user.nickname }, ...voters];
	}

	return {
		room: {
			id: room.id,
			creator_id: room.creator_id,
			public_id: room.public_id
		},
		user: {
			id: user.id,
			nickname: user.nickname
		},
		voters
	};
}) satisfies PageServerLoad;

function isNumber(val: string): boolean {
	return /^-?\d+$/.test(val);
}
