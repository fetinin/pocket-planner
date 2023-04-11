<script lang="ts">
	import { calcCoefficientOfVariation, calStdDeviation, maxVote, minVote } from './votes_stat';

	export let role: string;
	export let votes: number[];

	function shuffleVotes(votes: number[]): number[] {
		const shuffledVotes = [...votes];
		for (let i = shuffledVotes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledVotes[i], shuffledVotes[j]] = [shuffledVotes[j], shuffledVotes[i]];
		}
		return shuffledVotes;
	}
</script>

<div class="box">
	<div class="has-text-centered">
		{role}
	</div>
	<div>
		<p>👍</p>
		Votes: {shuffleVotes(votes)}<br />
		Min, Max: {minVote(votes).toFixed(2)}, {maxVote(votes).toFixed(2)}<br />
		Mean: {votes.reduce((a, b) => a + b, 0) / votes.length || 0}<br />
		Median: {votes.sort((a, b) => a - b)[Math.floor(votes.length / 2)] || 0}<br />
		Std. deviation: {calStdDeviation(votes).toFixed(2)}<br />
		Coef. of variation: {calcCoefficientOfVariation(votes).toFixed(2)}
	</div>
	<!-- <div class="circle">
		<div class="inner-circle">
			<span class="circle-text">
				
			</span>
		</div>
	</div> -->
</div>

<style>
	/* .circle {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background-color: rgb(159, 246, 39);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.inner-circle {
		width: 170px;
		height: 170px;
		border-radius: 50%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.circle-text {
		font-size: 0.7rem;
		text-align: center;
		color: black;
	} */
</style>
