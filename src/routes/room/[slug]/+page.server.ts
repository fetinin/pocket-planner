import { pb } from '$lib/store/pb';
import { Collections } from '$lib/store/types';
import { createNewUser, getUserID, logout } from '$lib/user';

import { error, fail } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type {
	RoomsResponse,
	RoomsVotersRecord,
	RoomsVotersResponse,
	VotersRecord,
	RoomsTasksRecord,
	VotersResponse,
	RoomsTasksResponse
} from '$lib/store/types';
type Voter = {
	id: string;
	nickname: string;
	vote: number | undefined;
	voted: boolean;
};

export const load = (async ({ params, cookies }) => {
	let userID = getUserID(cookies);
	if (!userID) {
		userID = await createNewUser(cookies);
	}

	try {
		var user = await pb.collection(Collections.Voters).getOne<VotersResponse>(userID);
	} catch (err) {
		console.error('voter not found, invalid user id', userID, err);
		logout(cookies);
		throw error(403, 'invalid userID in cookie. Cookie has been deleted, please try again');
	}

	try {
		var room = await pb
			.collection(Collections.Rooms)
			.getFirstListItem<RoomsResponse>(`public_id = '${params.slug}'`);
	} catch {
		throw error(404, {
			message: 'Room not found'
		});
	}

	const roomsVotersRecords = await pb
		.collection(Collections.RoomsVoters)
		.getFullList<RoomsVotersResponse>(20, { filter: `room_id='${room.id}'`, expand: 'voter_id' });

	let voters: Voter[] = roomsVotersRecords.map((r) => {
		return {
			id: r.voter_id,
			voted: Boolean(r.vote),
			nickname: (r.expand as { voter_id: VotersRecord }).voter_id.nickname,
			vote: r.vote
		};
	});

	const roomHasCurrentUser = roomsVotersRecords.some((r) => r.voter_id === user.id);
	if (!roomHasCurrentUser) {
		await pb
			.collection(Collections.RoomsVoters)
			.create(<RoomsVotersRecord>{ room_id: room.id, voter_id: user.id });
		voters = [{ id: user.id, voted: false, nickname: user.nickname, vote: undefined }, ...voters];
	}

	const tasksRecords = await pb
		.collection(Collections.RoomsTasks)
		.getFullList<RoomsTasksResponse>(50, { filter: `room_id='${room.id}'` });

	const tasks = tasksRecords.map((r) => {
		return { id: r.id, description: r.description, vote: r.vote };
	});

	return {
		room: {
			id: room.id,
			creator_id: room.creator_id,
			public_id: room.public_id
		},
		user: {
			id: user.id,
			nickname: user.nickname,
			isRoomAdmin: room.creator_id == user.id
		},
		voters,
		tasks
	};
}) satisfies PageServerLoad;

function isNumber(val: string): boolean {
	return /^-?\d+$/.test(val);
}

export const actions: Actions = {
	vote: async ({ request, cookies }) => {
		const userID = getUserID(cookies);
		if (!userID) {
			return fail(403);
		}

		const currentRoomVoter = await pb
			.collection(Collections.RoomsVoters)
			.getFirstListItem<RoomsVotersResponse>(`voter_id = '${userID}'`);

		const data = await request.formData();
		const voteValue = data.get('vote');
		if (!voteValue) {
			return fail(400, { vote: 'missing vote' });
		}

		await pb.collection(Collections.RoomsVoters).update<RoomsVotersResponse>(currentRoomVoter.id, <
			RoomsVotersRecord
		>{
			vote: parseInt(voteValue.toString())
		});

		return { success: true };
	},

	addTask: async ({ request, cookies }) => {
		const userID = getUserID(cookies);
		if (!userID) {
			return fail(403);
		}

		const data = await request.formData();
		const description = data.get('content');
		const roomID = data.get('room_id');

		await pb
			.collection(Collections.RoomsTasks)
			.create<RoomsTasksResponse>(<RoomsTasksRecord>{ description: description, room_id: roomID });

		return { success: true };
	},

	endVote: async ({ request }) => {
		const data = await request.formData();
		const roomID = data.get('room_id');
		const taskID = data.get('task_id');
		if (!taskID || !roomID) {
			return fail(400, { error: 'room_id or task_id is missing' });
		}

		const votesRecords = await pb
			.collection(Collections.RoomsVoters)
			.getFullList<RoomsVotersResponse>(20, { filter: `room_id = '${roomID}'` });

		if (!votesRecords.length) {
			return fail(403, { details: 'No one voted for task yet.' });
		}

		const votes = votesRecords.map((r) => r.vote).filter(Number) as number[];
		const avgScore = votes.reduce((p, c) => p + c) / votes.length;

		await pb.collection(Collections.RoomsTasks).update(taskID.toString(), { vote: avgScore });

		votesRecords.forEach(async (r) => {
			await pb.collection(Collections.RoomsVoters).update(r.id, { vote: null });
		});
		return { success: true };
	}
};
