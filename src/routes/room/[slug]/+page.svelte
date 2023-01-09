<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/store/pb';
	import { onDestroy, onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { Collections } from '$lib/store/types';
	import type { RoomsVotersRecord, RoomsVotersResponse, VotersRecord } from '$lib/store/types';
	import type { UnsubscribeFunc } from 'pocketbase';
	import { enhance } from '$app/forms';
	import Avatar from './Avatar.svelte';

	export let data: PageServerData;
	export let voters = data.voters;
	export let myVote = voters.find((v) => v.id == data.user.id)?.vote;
	$: currentTask = data.tasks.length ? data.tasks.at(-1) : undefined;

	let unsubVoters: UnsubscribeFunc;
	onMount(async () => {
		voters = [
			{ id: '1', voted: false, nickname: 'Grey Salmon', vote: undefined },
			{ id: '2', voted: false, nickname: 'Funny Rabbit', vote: undefined },
			{ id: '3', voted: false, nickname: 'Happy Rainbow', vote: undefined },
			{ id: '4', voted: false, nickname: 'Smily Dear', vote: undefined },
			...voters
		];
		unsubVoters = await pb
			.collection(Collections.RoomsVoters)
			.subscribe<RoomsVotersRecord>('*', async function ({ action, record }) {
				if (record.room_id !== data.room.id) {
					return;
				}

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
						voters.map((v) => {
							if (v.id == record.voter_id) {
								v.voted = Boolean(record.vote);
							}
						});
						voters = voters;
						break;
					case 'delete':
						voters = voters.filter((v) => v.id !== record.voter_id);
						console.debug('delete voter', record);
				}
			});
		// todo: add subscription to room tasks
		// update tasks list
		// reset myVote after vote is finished
	});

	onDestroy(async () => {
		if (browser) {
			let currentRoomVoter = await pb
				.collection(Collections.RoomsVoters)
				.getFirstListItem<RoomsVotersResponse>(`voter_id = '${data.user.id}'`);
			await pb.collection(Collections.RoomsVoters).delete(currentRoomVoter.id);
			await unsubVoters();
		}
	});

	export const numbers = [1, 3, 5, 10, 12];
</script>

<div class="columns">
	<div class="column">
		<h1>Room: {$page.params.slug}</h1>
	</div>
</div>

<div class="columns">
	{#each voters as v (v.id)}
		<div class="column">
			<Avatar nickname={v.nickname} voted={v.voted} />
		</div>
	{/each}
</div>

<div class="columns">
	<div class="column is-offset-one-quarter is-two-quarter">
		<h2>Hi {data.user.nickname}</h2>

		{#if !currentTask?.vote}
			<form action="?/vote" method="POST" use:enhance>
				<input type="hidden" name="vote" id="vote" value={myVote} />
				{#each numbers as n (n)}
					<button class="button" class:is-active={myVote === n} on:click={() => (myVote = n)}
						>{n}</button
					>
				{/each}
			</form>
		{/if}

		{#if myVote}
			<p>You voted: {myVote}</p>
		{/if}

		{#if data.user.isRoomAdmin}
			<div class="box">
				{#if currentTask?.vote}
					<form action="?/addTask" method="post" use:enhance>
						<input type="hidden" name="room_id" value={data.room.id} />
						<textarea class="textarea" name="content" id="content" placeholder="e.g. Hello world" />
						<button class="button">Погнали!</button>
					</form>
				{:else}
					<form action="?/endVote" method="post" use:enhance>
						<input type="hidden" name="room_id" value={data.room.id} />
						<input type="hidden" name="task_id" value={data.tasks.at(-1)?.id} />
						<button class="button">Стопэ</button>
					</form>
				{/if}
			</div>
		{/if}

		{#each data.tasks.reverse() as task (task.id)}
			<div class="box">
				<p>
					{task.description}
					{#if task.vote} -- {task.vote}{/if}
				</p>
			</div>
		{/each}
	</div>
	<div class="column is-one-quarter" />
</div>
