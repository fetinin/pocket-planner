<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/store/pb';
	import { onDestroy, onMount } from 'svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	export let voters = data.voters;

	let unsubVoters: () => void;
	onMount(async () => {
		unsubVoters = await pb
			.collection('rooms_voters')
			.subscribe('*', async function ({ action, record }) {
				if (record.room_id !== data.room.id) {
					return;
				}

				switch (action) {
					case 'create':
						const user = await pb.collection('voters').getOne(record.voter_id);
						voters = [{ id: record.voter_id, voted: false, nickname: user.nickname }, ...voters];
						console.log('delete user', record.voter_id);
						break;
					case 'delete':
						console.log(voters);
						console.log(record.voter_id);
						voters = voters.filter((v) => v.id !== record.voter_id);
						console.log('delete user', record.voter_id);
				}
			});
	});

	onDestroy(async () => {
		if (browser) {
			let currentRoomVoter = await pb
				.collection('rooms_voters')
				.getFirstListItem(`voter_id = '${data.user.id}'`);
			pb.collection('rooms_voters').delete(currentRoomVoter.id);
			unsubVoters();
		}
	});

	export const numbers = [1, 3, 5, 10, 12];
	export let chosen: Number;

	function vote(i: any) {
		chosen = numbers[i];
	}
</script>

<div class="columns">
	<div class="column is-offset-one-quarter is-two-quarter">
		<h1>Room: {$page.params.slug}</h1>
		<h2>Hi {data.user.nickname}</h2>

		{#each numbers as n, i (n)}
			<button class="button" class:is-active={chosen === n} on:click={() => vote(i)}
				>{n} - {i}</button
			>
		{/each}

		{#if chosen}
			<p>You voted: {chosen}</p>
		{/if}
	</div>
	<div class="column is-one-quarter">
		{#each voters as v (v.id)}
			<div class="box">
				<img
					src="https://avatars.dicebear.com/api/personas/{v.nickname}.svg?size=60"
					alt="{v.id} icon"
				/>
				<p>
					{v.nickname}{#if v.voted}✅{:else}❌{/if}
				</p>
			</div>
		{/each}
	</div>
</div>
