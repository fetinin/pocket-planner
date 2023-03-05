import { pb } from '$lib/store/pb';

import { Collections } from '../../../lib/store/types';

import type { RoomsVotersResponse, RoomsTasksResponse } from '$lib/store/types';
import type { Task, VoteByRole, Voter } from './+page.server';

export async function handleVotersUpdate(
	voters: Voter[],
	action: string,
	record: RoomsVotersResponse
): Promise<Voter[]> {
	console.debug(`handling voters ${action}`);
	switch (action) {
		case 'create':
			const voter = await pb.collection(Collections.Voters).getOne(record.voter_id);
			voters = [
				{
					id: record.voter_id,
					voted: false,
					nickname: voter.nickname,
					vote: record.vote,
					role: record.role
				},
				...voters
			];
			console.debug('add voter', record);
			break;
		case 'update':
			voters = voters.map((v) => {
				if (v.id === record.voter_id) {
					console.debug('update voter', v);
					v = {
						...v,
						voted: Boolean(record.vote),
						vote: record.vote,
						role: record.role
					};
				}
				return v;
			});
			break;
		case 'delete':
			voters = voters.filter((v) => v.id !== record.voter_id);
			console.debug('delete voter', record);
			break;
	}
	return voters;
}

export function handleTasksUpdate(
	tasks: Task[],
	action: string,
	record: RoomsTasksResponse
): Task[] {
	switch (action) {
		case 'create':
			tasks = [
				...tasks,
				{
					id: record.id,
					description: record.description,
					vote: record.vote,
					voteByRole: record.vote_by_role as VoteByRole
				}
			];
			break;
		case 'update':
			tasks = tasks.map((r) => {
				if (r.id == record.id) {
					return {
						id: record.id,
						description: record.description,
						vote: record.vote,
						voteByRole: record.vote_by_role as VoteByRole
					};
				}
				return r;
			});
			break;
		case 'delete':
			tasks = tasks.filter((r) => r.id == record.id);
			break;
	}
	return tasks;
}
