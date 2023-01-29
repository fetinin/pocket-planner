<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/store/pb';
	import { onDestroy, onMount } from 'svelte';
	import type { ActionData, PageServerData } from './$types';
	import { Collections, type RoomsTasksResponse } from '$lib/store/types';
	import type { RoomsVotersResponse } from '$lib/store/types';
	import type { UnsubscribeFunc } from 'pocketbase';
	import { enhance } from '$app/forms';
	import Avatar from './Avatar.svelte';

	export let data: PageServerData;
	export let voters = data.voters;
	export let myVote = voters.find((v) => v.id == data.user.id)?.vote;
	$: currentTask = data.tasks.length ? data.tasks.at(-1) : undefined;

	export let form: ActionData;

	export const numbers = [1, 3, 5, 7, 15, 21, 29];

	let unsubVoters: UnsubscribeFunc;
	let unsubTasks: UnsubscribeFunc;

	function submitOnAltEnter(e: KeyboardEvent) {
		const altKeyPressed = e.altKey || e.metaKey;
		if (!altKeyPressed || e.key !== 'Enter') {
			return;
		}

		(e.target as HTMLFormElement).form.submit();
	}

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
						console.log('voters before', voters);
						voters.map((v) => {
							if (v.id === record.voter_id) {
								v.voted = Boolean(record.vote);
								v.vote = record.vote;
							}
						});
						console.log('voters after', voters);
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
						break;
					case 'delete':
						data.tasks = data.tasks.filter((r) => r.id == record.id);
						break;
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

<div class="columns is-multiline is-centered">
	{#each voters as v (v.id)}
		<div class="column is-one-quarter">
			<Avatar
				nickname={v.nickname}
				isYou={v.id === data.user.id}
				vote={v.vote}
				showVote={Boolean(currentTask?.vote)}
			/>
		</div>
	{/each}
</div>

<div class="columns is-centered">
	<div class="column box is-half p-5">
		<div class="columns has-text-centered">
			<div class="column">
				{#if !currentTask}
					<p class="m-3">
						Hi!<br />
						{#if data.user.isRoomAdmin}Write your first task to vote for👇
						{:else}
							⏳ Please wait room admin to start ⏳
						{/if}
					</p>
				{/if}
				{#if currentTask}
					{#if !currentTask.vote}
						<p class="mb-2">Voting for👇</p>
						<div class="box">
							<p>{currentTask.description}</p>
						</div>
					{:else if !data.user.isRoomAdmin}<p class="mb-2">⏳ Waiting for the next task ⏳</p>
					{/if}
				{/if}
			</div>
		</div>

		{#if currentTask && !currentTask?.vote}
			<div class="columns">
				<div class="colum">
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
			</div>
		{/if}

		{#if data.user.isRoomAdmin}
			<div class="columns">
				<div class="column">
					{#if !currentTask || currentTask?.vote}
						<form action="?/addTask" method="post" use:enhance on:keypress={submitOnAltEnter}>
							<input type="hidden" name="room_id" value={data.room.id} />
							<textarea
								class="textarea"
								name="content"
								id="content"
								placeholder="e.g. Add new shopping cart handler"
							/>
							{#if form?.addTask?.error?.description}<p class="has-text-danger">
									Enter task description
								</p>{/if}
							<button class="button mt-3">Let's go!</button>
						</form>
					{:else}
						<form action="?/endVote" method="post" use:enhance>
							<input type="hidden" name="room_id" value={data.room.id} />
							<input type="hidden" name="task_id" value={data.tasks.at(-1)?.id} />
							<button class="button is-danger">Stop voting</button>
						</form>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<div class="columns is-centered">
	<div class="column is-half">
		{#each data.tasks.filter((t) => t.vote).reverse() as task (task.id)}
			<div class="box">
				<p>
					{task.description}
					{#if task.vote} 👉 {task.vote} points{/if}
				</p>
			</div>
		{/each}
	</div>
</div>
