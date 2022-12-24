<script>
	let participants = [
		{ name: 'John', voted: true },
		{ name: 'Sarah', voted: false },
		{ name: 'Mike', voted: true },
		{ name: 'Connor', voted: true }
	];
</script>

<div class="columns">
	<div class="column is-offset-one-quarter is-three-fifths">
		<slot />
	</div>
	<div class="column">
		{#each participants as p (p.name)}
			<p>{p.name}{#if p.voted}✅{:else}❌{/if}</p>
		{/each}
	</div>
</div>

<style>
</style>
