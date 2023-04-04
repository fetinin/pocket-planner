import { pb } from '$lib/store/pb';
import { Collections, RoomsVotersRoleOptions } from '$lib/store/types';
import { createNewUser, getUserID, logout } from '$lib/user';

import { wrapLoadWithSentry } from '@sentry/sveltekit';
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
export type Voter = {
	id: string;
	nickname: string;
	vote?: number;
	voted: boolean;
	role?: RoomsVotersRoleOptions;
};
export type Task = {
	id: string;
	description: string;
	vote?: number;
	voteByRole?: VoteByRole;
};
export type VoteByRole = { [key in keyof typeof RoomsVotersRoleOptions]: number };

export const load = wrapLoadWithSentry(async ({ params, cookies }) => {
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
			vote: r.vote,
			role: r.role
		};
	});

	const roomHasCurrentUser = roomsVotersRecords.some((r) => r.voter_id === user.id);
	if (!roomHasCurrentUser) {
		await pb.collection(Collections.RoomsVoters).create(<RoomsVotersRecord>{
			room_id: room.id,
			voter_id: user.id
		});
		voters = [{ id: user.id, voted: false, nickname: user.nickname, vote: undefined }, ...voters];
	}

	const tasksRecords = await pb
		.collection(Collections.RoomsTasks)
		.getFullList<RoomsTasksResponse>(50, { filter: `room_id='${room.id}'`, order: 'created' });

	const tasks: Task[] = tasksRecords.map((r) => {
		return {
			id: r.id,
			description: r.description,
			vote: r.vote,
			voteByRole: r.vote_by_role as VoteByRole
		};
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

export const actions: Actions = {
	vote: async ({ request, cookies }) => {
		const userID = getUserID(cookies);
		if (!userID) {
			throw error(403);
		}

		const data = await request.formData();
		const voteValue = data.get('vote');
		if (!voteValue) {
			return fail(400, { vote: { error: 'missing vote' } });
		}

		const roomID = data.get('room_id');
		if (!roomID) {
			return fail(400, { vote: { error: 'missing room_id' } });
		}

		try {
			var currentRoomVoter = await pb
				.collection(Collections.RoomsVoters)
				.getFirstListItem<RoomsVotersResponse>(`voter_id = '${userID}' && room_id = '${roomID}'`);
		} catch (err) {
			console.error('Room voter not found', userID);
			throw error(403);
		}

		const role = currentRoomVoter.role;
		if (!role || role === RoomsVotersRoleOptions.observer) {
			throw error(403, 'Voting without role or as observer is not allowed');
		}

		await pb.collection(Collections.RoomsVoters).update(currentRoomVoter.id, <RoomsVotersRecord>{
			vote: parseInt(voteValue.toString())
		});

		return { success: true };
	},

	addTask: async ({ request, cookies }) => {
		const userID = getUserID(cookies);
		if (!userID) {
			throw error(403);
		}

		const data = await request.formData();
		const description = data.get('content');
		const roomID = data.get('room_id');

		if (!description) {
			return fail(400, { addTask: { error: { description: 'content is required' } } });
		}
		if (!roomID) {
			return fail(400, { addTask: { error: { description: 'room_id is required' } } });
		}

		await pb
			.collection(Collections.RoomsTasks)
			.create<RoomsTasksRecord>({ description: description, room_id: roomID });

		const votesRecords = await pb
			.collection(Collections.RoomsVoters)
			.getFullList<RoomsVotersResponse>(20, { filter: `room_id = '${roomID}'` });

		votesRecords.forEach(async (r) => {
			await pb.collection(Collections.RoomsVoters).update(r.id, { vote: null });
		});
		return { success: true };
	},

	endVote: async ({ request }) => {
		const data = await request.formData();
		const roomID = data.get('room_id');
		const taskID = data.get('task_id');
		if (!taskID || !roomID) {
			throw error(400, 'room_id or task_id is missing');
		}

		const votesRecords = await pb
			.collection(Collections.RoomsVoters)
			.getFullList<RoomsVotersResponse>(20, { filter: `room_id = '${roomID}'` });

		if (!votesRecords.filter((r) => Boolean(r.vote)).length) {
			return fail(403, { endVote: { error: 'No one voted for the task yet.' } });
		}

		let votesByRole = new Map<string, number[]>();
		votesRecords.forEach((vote) => {
			if (!vote.role || !vote.vote) return;

			let roleVotes = votesByRole.get(vote.role) || [];
			roleVotes.push(vote.vote);
			votesByRole.set(vote.role, roleVotes);
		});

		let avgVotesByRole = new Map<string, number>();
		votesByRole.forEach((votes, role, _) => {
			const avgScore = votes.reduce((p, c) => p + c) / votes.length;
			avgVotesByRole.set(role, avgScore);
		});

		const votes = votesRecords.map((r) => r.vote).filter(notUndefined);
		const avgScore = votes.reduce((p, c) => p + c) / votes.length;

		await pb.collection(Collections.RoomsTasks).update<RoomsTasksRecord>(taskID.toString(), {
			vote: avgScore,
			vote_by_role: JSON.stringify(Object.fromEntries(avgVotesByRole))
		});

		return { success: true };
	},

	setRole: async ({ request, cookies }) => {
		const userID = getUserID(cookies);
		if (!userID) {
			throw error(403);
		}

		const data = await request.formData();

		const role = data.get('role');
		if (!role) {
			throw error(400, 'role is missing');
		}

		const roomID = data.get('room_id');
		if (!roomID) {
			throw error(400, 'room_id is missing');
		}

		try {
			var roomVoter = await pb
				.collection(Collections.RoomsVoters)
				.getFirstListItem<RoomsVotersResponse>(`voter_id = '${userID}' && room_id = '${roomID}'`);
		} catch (err) {
			console.error('Room voter not found', userID);
			throw error(403);
		}

		await pb
			.collection(Collections.RoomsVoters)
			.update<RoomsVotersRecord>(roomVoter.id, { role: role });

		return { success: true };
	}
};

function notUndefined<T>(x: T | undefined): x is T {
	return x !== undefined;
}
