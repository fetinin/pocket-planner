<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/store/pb';
	import { onDestroy, onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { Collections } from '$lib/store/types';
	import type { RoomsVotersRecord, RoomsVotersResponse, VotersRecord } from '$lib/store/types';
	import type { UnsubscribeFunc } from 'pocketbase';

	export let data: PageServerData;
	export let voters = data.voters;

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
						voters = [{ id: record.voter_id, voted: false, nickname: voter.nickname }, ...voters];
						console.debug('add voter', record.voter_id);
						break;
					case 'delete':
						voters = voters.filter((v) => v.id !== record.voter_id);
						console.debug('delete voter', record.voter_id);
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
