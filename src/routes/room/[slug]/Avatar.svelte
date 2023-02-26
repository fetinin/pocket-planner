<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let nickname: string;
	export let vote: number | undefined;
	export let isYou: boolean;
	export let showVote: boolean;
	export let role: string | undefined;

	function roleAsIcon(role?: string): string {
		switch (role) {
			case 'dev':
				return '💻';
			case 'qa':
				return '🦊';
			case 'observer':
				return '🕶️';
			default:
				return '🤔';
		}
	}
</script>

<div class="card">
	<div class="card-content">
		<div class="media">
			<div class="media-left">
				<figure class="image is-48x48">
					<img
						src="https://avatars.dicebear.com/api/personas/{nickname}.svg?size=60"
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
		{#if role !== 'observer'}
			<p class="has-text-centered">
				{#if vote}✅{:else}❌{/if}
				{#if vote && showVote}{vote}{/if}
			</p>
		{/if}
	</div>
</div>

<style>
	button.role {
		all: unset;
		cursor: pointer;
	}
</style>
