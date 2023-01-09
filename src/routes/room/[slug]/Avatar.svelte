<script lang="ts">
	export let nickname: string;
	export let voted: boolean;
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
				<p class="title is-5">{nickname}</p>
			</div>
		</div>
		<p class="has-text-centered">
			{#if voted}✅{:else}❌{/if}
		</p>
	</div>
</div>
