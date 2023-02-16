import { pb } from '$lib/store/pb';

import { Collections } from '../../../lib/store/types';

import type { RoomsVotersResponse, RoomsTasksResponse } from '$lib/store/types';
import type { Task, Voter } from './+page.server';

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
				{ id: record.voter_id, voted: false, nickname: voter.nickname, vote: record.vote },
				...voters
			];
			console.debug('add voter', record);
			break;
		case 'update':
			console.log('voters before', voters);
			voters.map((v) => {
				if (v.id === record.voter_id) {
					v.voted = Boolean(record.vote);
					v.vote = record.vote;
				}
			});
			console.log('voters after', voters);
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
			tasks = [...tasks, { id: record.id, description: record.description, vote: record.vote }];
			break;
		case 'update':
			tasks = tasks.map((r) => {
				if (r.id == record.id) {
					return { id: record.id, description: record.description, vote: record.vote };
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
