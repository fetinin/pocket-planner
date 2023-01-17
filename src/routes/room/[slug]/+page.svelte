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
		{#if !currentTask}
			<h2>Hi {data.user.nickname}! Write your first task to vote for👇</h2>
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
