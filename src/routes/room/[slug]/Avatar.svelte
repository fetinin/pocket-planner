<script lang="ts">
	export let nickname: string;
	export let vote: number | undefined;
	export let isYou: boolean;
	export let showVote: boolean;
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
				<p class="title is-5 mb-0">{nickname}</p>
				{#if isYou}<p>(you)</p>{/if}
			</div>
		</div>
		<p class="has-text-centered">
			{#if vote}✅{:else}❌{/if}
			{#if vote && showVote}{vote}{/if}
		</p>
	</div>
</div>
