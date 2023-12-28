<script lang="ts">
	import { RoomsVotersRoleOptions } from '$lib/store/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let nickname: string;
	export let vote: number | undefined;
	export let isYou: boolean;
	export let isVotingPhase: boolean;
	export let role: RoomsVotersRoleOptions | undefined;

	function roleAsIcon(role?: string): string {
		switch (role) {
			case RoomsVotersRoleOptions.dev:
				return '💻';
			case RoomsVotersRoleOptions.qa:
				return '🦊';
			case RoomsVotersRoleOptions.observer:
				return '🕶️';
			default:
				return '🥸';
		}
	}

	function isObserver(role?: RoomsVotersRoleOptions): boolean {
		return !role || role === RoomsVotersRoleOptions.observer;
	}
</script>

<div class="card">
	<div class="card-content">
		<div class="media">
			<div class="media-left">
				<figure class="image is-48x48">
					<img
						src="https://api.dicebear.com/7.x/personas/svg?size=60&seed={nickname}"
						alt="{nickname} icon"
					/>
				</figure>
			</div>
			<div class="media-content">
				<p class="title is-5 mb-0">
					{nickname}
					{#if isYou}
						<button class="role" on:click={() => dispatch('roleClicked')}>{roleAsIcon(role)}</button
						>
					{:else}
						{roleAsIcon(role)}
					{/if}
				</p>
				{#if isYou}<p>(you)</p>{/if}
			</div>
		</div>

		<p class="has-text-centered">
			{#if !isObserver(role)}
				{#if isVotingPhase}
					{#if vote}✅{:else}🤔{/if}
				{:else if vote}{vote}
				{/if}
			{/if}
		</p>
	</div>
</div>

<style>
	button.role {
		all: unset;
		cursor: pointer;
	}
	.card {
		height: 100%;
	}
</style>
