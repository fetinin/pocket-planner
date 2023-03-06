<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/store/pb';
	import { onDestroy, onMount } from 'svelte';
	import type { ActionData, PageServerData } from './$types';
	import { Collections, type RoomsTasksResponse, RoomsVotersRoleOptions } from '$lib/store/types';
	import type { RoomsVotersResponse } from '$lib/store/types';
	import type { UnsubscribeFunc } from 'pocketbase';
	import { enhance } from '$app/forms';
	import Avatar from './Avatar.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { handleTasksUpdate, handleVotersUpdate } from './subscription_handlers';

	export let data: PageServerData;
	export let voters = data.voters;
	export let myVote = voters.find((v) => v.id == data.user.id)?.vote;
	$: currentTask = data.tasks.length ? data.tasks.at(-1) : undefined;

	export let form: ActionData;

	export const voteOptions = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 100500];

	export const roles: RoomsVotersRoleOptions[] = [
		RoomsVotersRoleOptions.dev,
		RoomsVotersRoleOptions.qa,
		RoomsVotersRoleOptions.observer
	];
	export let myRole = voters.find((v) => v.id == data.user.id)?.role;
	export let showRoleSelect = !myRole;

	function roleAsText(role?: string): string {
		switch (role) {
			case 'dev':
				return 'Dev 💻';
			case 'qa':
				return 'QA 🦊';
			case 'observer':
				return 'Observer 🕶️';
			default:
				return '?!';
		}
	}
	function isObserver(role?: RoomsVotersRoleOptions): boolean {
		return !role || role === RoomsVotersRoleOptions.observer;
	}

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
			.subscribe<RoomsVotersResponse>('*', async ({ action, record }) => {
				if (record.room_id !== data.room.id) return;

				voters = await handleVotersUpdate(voters, action, record);
			});
		unsubTasks = await pb
			.collection(Collections.RoomsTasks)
			.subscribe<RoomsTasksResponse>('*', async ({ action, record }) => {
				if (record.room_id !== data.room.id) return;

				data.tasks = handleTasksUpdate(data.tasks, action, record);
				if (action === 'create') {
					myVote = undefined;
				}
			});
	});

	onDestroy(async () => {
		if (!browser) return;

		let currentRoomVoter = await pb
			.collection(Collections.RoomsVoters)
			.getFirstListItem<RoomsVotersResponse>(`voter_id = '${data.user.id}'`);
		await pb.collection(Collections.RoomsVoters).delete(currentRoomVoter.id);
		await unsubVoters();
		await unsubTasks();
	});
</script>

<div class="columns">
	<div class="column">
		<h1>Room: {$page.params.slug}</h1>
	</div>
</div>

<div class="columns is-multiline is-centered voters">
	{#each voters as v (v.id)}
		<div class="column is-one-quarter" animate:flip={{ duration: 400, easing: quintOut }}>
			<Avatar
				nickname={v.nickname}
				isYou={v.id === data.user.id}
				vote={v.vote}
				isVotingPhase={Boolean(currentTask)}
				role={v.role}
				on:roleClicked={() => (showRoleSelect = !showRoleSelect)}
			/>
		</div>
	{/each}
</div>

{#if showRoleSelect}
	<div class="columns is-centered mb-5" in:slide={{ duration: 200 }} out:slide={{ duration: 200 }}>
		<div class="column box is-three-quarters is-full-mobile p-5">
			<div class="columns">
				<div class="column">
					<p class="has-text-centered">Choose your role 🥸</p>
					<form
						action="?/setRole"
						method="POST"
						use:enhance
						on:submit={(e) => {
							showRoleSelect = false;
						}}
					>
						<input type="hidden" name="room_id" id="room_id" value={data.room.id} />
						<input type="hidden" name="role" id="role" value={myRole} />
						<div class="has-text-centered">
							{#each roles as role (role)}
								<button
									class="button m-2"
									class:is-active={myRole === role}
									on:click={() => (myRole = role)}>{roleAsText(role)}</button
								>
							{/each}
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="columns is-centered">
	<div class="column box is-three-quarters is-full-mobile p-5">
		<div class="columns has-text-centered">
			<div class="column">
				{#if !currentTask}
					<p class="m-3">
						Hi!<br />
						{#if data.user.isRoomAdmin}
							Write your first task to vote for👇
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
					{:else if !data.user.isRoomAdmin}<p class="mb-2">⏳ Waiting for a next task ⏳</p>
					{/if}
				{/if}
			</div>
		</div>

		{#if currentTask && !currentTask?.vote && !isObserver(myRole)}
			<div class="columns">
				<div class="column">
					<form action="?/vote" method="POST" use:enhance>
						<input type="hidden" name="room_id" id="room_id" value={data.room.id} />
						<input type="hidden" name="vote" id="vote" value={myVote} />
						<div class="has-text-centered">
							{#each voteOptions as n (n)}
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
						<form action="?/addTask" method="POST" use:enhance on:keypress={submitOnAltEnter}>
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
						<form action="?/endVote" method="POST" use:enhance class="has-text-centered">
							<input type="hidden" name="room_id" value={data.room.id} />
							<input type="hidden" name="task_id" value={data.tasks.at(-1)?.id} />
							<button class="button is-danger">Finish voting</button>
							{#if form?.endVote?.error}
								<p class="has-text-danger">{form.endVote.error}</p>
							{/if}
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
				</p>
				{#if task.voteByRole?.dev}
					<p>Dev - {task.voteByRole.dev} points</p>
				{/if}
				{#if task.voteByRole?.qa}
					<p>QA - {task.voteByRole.qa} points</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.voters .column {
		min-width: 300px;
	}
</style>
