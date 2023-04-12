<script lang="ts">
	import {
		calculateAgreementLevel,
		calculateCVNormilized,
		calculatePercentAgreed,
		maxVote,
		minVote,
		calcMean,
		calcMedian
	} from './votes_stat';

	export let role: string;
	export let votes: number[];

	$: agreementLevel = calculateAgreementLevel(votes);
	$: extraStatsTooltip = `Min, Max: ${minVote(votes).toFixed(2)}, ${maxVote(votes).toFixed(2)}
			Mean: ${calcMean(votes).toFixed(2)}
			Median: ${calcMedian(votes)}
			Agreement coefficient: ${calculatePercentAgreed(votes).toFixed(2)}
			Votes variation coefficient: ${calculateCVNormilized(votes).toFixed(2)}
			Agreement: ${agreementLevel.toFixed(2)}`;

	function shuffleVotes(votes: number[]): number[] {
		const shuffledVotes = [...votes];
		for (let i = shuffledVotes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledVotes[i], shuffledVotes[j]] = [shuffledVotes[j], shuffledVotes[i]];
		}
		return shuffledVotes;
	}

	function agreementRotation(agreement: number) {
		const agreementDegree = 0 - (1 - agreement) * 180;
		return `rotate(${agreementDegree}deg)`;
	}

	function agreementIcon(agreement: number) {
		if (agreement < 0.2) return '🫠';
		if (agreement < 0.5) return '🙁';
		if (agreement < 0.7) return '😐';
		if (agreement < 0.9) return '😐';
		return '🤩';
	}
</script>

<div class="box">
	<div class="has-text-centered">
		{role}
	</div>
	<div>
		<p class="has-text-centered">
			<span class="tooltip">
				<span class="is-size-3 clickable-text">{agreementIcon(agreementLevel)}</span>
				<span class="tooltiptext">{extraStatsTooltip}</span>
			</span>
			<span
				class="is-size-4"
				style="display: inline-block"
				style:transform={agreementRotation(agreementLevel)}>👍</span
			>
		</p>
		<p class="has-text-centered">
			Votes: {shuffleVotes(votes)}<br />
		</p>
	</div>
</div>

<style>
	.clickable-text {
		all: unset;
		cursor: pointer;
	}
	.tooltip {
		position: relative;
		display: inline-block;
		/* border-bottom: 0.5px dashed grey; */
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		width: 250px;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		text-align: center;
		padding: 2px 0;
		border-radius: 6px;
		left: -3px;
		top: 90%;
		font-size: 10pt;
		white-space: pre-line;

		position: absolute;
		z-index: 1;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}
</style>
