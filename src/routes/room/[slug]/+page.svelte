<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/store/pb';
	import { onDestroy, onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { Collections, type RoomsTasksResponse } from '$lib/store/types';
	import type { RoomsVotersResponse, RoomsTasksRecord } from '$lib/store/types';
	import type { UnsubscribeFunc } from 'pocketbase';
	import { enhance } from '$app/forms';
	import Avatar from './Avatar.svelte';

	export let data: PageServerData;
	export let voters = data.voters;
	export let myVote = voters.find((v) => v.id == data.user.id)?.vote;
	$: currentTask = data.tasks.length ? data.tasks.at(-1) : undefined;

	export const numbers = [1, 3, 5, 7, 15, 21, 29];

	let unsubVoters: UnsubscribeFunc;
	let unsubTasks: UnsubscribeFunc;

	onMount(async () => {
		unsubVoters = await pb
			.collection(Collections.RoomsVoters)
			.subscribe<RoomsVotersResponse>('*', async function ({ action, record }) {
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
		unsubTasks = await pb
			.collection(Collections.RoomsTasks)
			.subscribe<RoomsTasksResponse>('*', async function ({ action, record }) {
				if (record.room_id !== data.room.id) {
					return;
				}
				switch (action) {
					case 'create':
						data.tasks = [
							...data.tasks,
							{ id: record.id, description: record.description, vote: record.vote }
						];
						break;
					case 'update':
						myVote = undefined;
						data.tasks = data.tasks.map((r) => {
							if (r.id == record.id) {
								return { id: record.id, description: record.description, vote: record.vote };
							}
							return r;
						});
					case 'delete':
						data.tasks = data.tasks.filter((r) => r.id == record.id);
				}
			});
	});

	onDestroy(async () => {
		if (browser) {
			let currentRoomVoter = await pb
				.collection(Collections.RoomsVoters)
				.getFirstListItem<RoomsVotersResponse>(`voter_id = '${data.user.id}'`);
			await pb.collection(Collections.RoomsVoters).delete(currentRoomVoter.id);
			await unsubVoters();
			await unsubTasks();
		}
	});
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
		{#if !currentTask}
			<h2 class="mb-3">
				Hi {data.user.nickname}! {#if data.user.isRoomAdmin}Write your first task to vote for👇{/if}
			</h2>
		{/if}
		{#if currentTask && !currentTask.vote}
			<div class="box">
				<p class="has-text-centered mb-2">Voting for👇</p>
				<p class="has-text-centered">
					{currentTask.description}
				</p>
			</div>
		{/if}

		<div class="box is-flex is-justify-content-center">
			<div class="colimns">
				{#if currentTask && !currentTask?.vote}
					<div class="column is-full">
						<form action="?/vote" method="POST" use:enhance>
							<input type="hidden" name="vote" id="vote" value={myVote} />
							<!-- todo: center buttons -->
							<div>
								{#each numbers as n (n)}
									<button
										class="button m-2"
										class:is-active={myVote === n}
										on:click={() => (myVote = n)}>{n}</button
									>
								{/each}
							</div>
						</form>
					</div>
				{/if}

				<div class="column is-full is-flex is-justify-content-center">
					{#if myVote}
						<p>You voted: {myVote}</p>
					{/if}
				</div>
				{#if data.user.isRoomAdmin}
					<div class="column is-full is-flex is-justify-content-center">
						{#if !currentTask || currentTask?.vote}
							<form action="?/addTask" method="post" use:enhance>
								<input type="hidden" name="room_id" value={data.room.id} />
								<!-- // todo: add submit on Cmd+Enter -->
								<textarea
									class="textarea"
									name="content"
									id="content"
									placeholder="e.g. Hello world"
								/>
								<button class="button">Let's go!</button>
							</form>
						{:else}
							<form action="?/endVote" method="post" use:enhance>
								<input type="hidden" name="room_id" value={data.room.id} />
								<input type="hidden" name="task_id" value={data.tasks.at(-1)?.id} />
								<button class="button is-danger">Stop voting</button>
							</form>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		{#each data.tasks.filter((t) => t.vote).reverse() as task (task.id)}
			<div class="box">
				<p>
					{task.description}
					{#if task.vote} 👉 {task.vote} points{/if}
				</p>
			</div>
		{/each}
	</div>
	<div class="column is-one-quarter" />
</div>
