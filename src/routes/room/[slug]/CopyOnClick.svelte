<script lang="ts">
	export let content: string;
	export let textToCopy: string;

	let tooltip = 'Copy';

	function onClick() {
		navigator.clipboard.writeText(textToCopy);
		tooltip = 'Copied';
	}
</script>

<div class="tooltip">
	<button class="clickable-text" on:click={onClick} on:mouseleave={() => (tooltip = 'Copy')}>
		{content}
	</button>
	<span class="tooltiptext">{tooltip}</span>
</div>

<style>
	.clickable-text {
		all: unset;
		cursor: pointer;
	}
	.tooltip {
		position: relative;
		display: inline-block;
		border-bottom: 0.5px dashed grey;
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		width: 50px;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		text-align: center;
		padding: 2px 0;
		border-radius: 6px;
		left: -3px;
		top: 90%;
		font-size: 10pt;

		position: absolute;
		z-index: 1;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}
</style>
