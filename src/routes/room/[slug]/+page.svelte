<script lang="ts">
	import { page } from '$app/stores';

	export const numbers = [1, 3, 5, 10, 12];

	export let chosen: Number;

	function vote(i: any) {
		chosen = numbers[i];
	}
</script>

<h1>Room: {$page.params.slug}</h1>

{#each numbers as n, i (n)}
	<button class="button" class:is-active={chosen === n} on:click={() => vote(i)}>{n} - {i}</button>
{/each}

{#if chosen}
	<p>You voted: {chosen}</p>
{/if}
