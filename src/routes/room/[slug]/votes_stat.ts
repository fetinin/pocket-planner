export function minVote(votes: number[]): number {
	if (!votes.length) return 0;

	return Math.min(...votes);
}

export function maxVote(votes: number[]): number {
	if (!votes.length) return 0;

	return Math.max(...votes);
}

export function calStdDeviation(votes: number[]): number {
	if (!votes.length) return 0;

	// For the given votes of 3, 8, 10, 3:
	// 1. Calculate the mean: `(3 + 8 + 10 + 3) / 4 = 6`
	const mean = votes.reduce((p, c) => p + c) / votes.length;

	// 2. Calculate the variance: `((3-6)² + (8-6)² + (10-6)² + (3-6)²) / 4 = 9.5`
	const variance = votes.map((v) => Math.pow(v - mean, 2)).reduce((p, n) => p + n) / votes.length;

	// 3. Calculate the standard deviation: `sqrt(10) ≈ 3.08`
	return Math.sqrt(variance);
}

export function calcCoefficientOfVariation(votes: number[]): number {
	if (!votes.length) return 0;

	// 1. Calculate the mean: `(3 + 8 + 10 + 3) / 4 = 6`
	const mean = votes.reduce((p, c) => p + c) / votes.length;

	// 2. Calculate the standard deviation: `sqrt(10) ≈ 3.16`
	const stdDeviation = calStdDeviation(votes);

	// 3. Calculate the coefficient of variation: `3.16 / 6 ≈ 0.53`
	return stdDeviation / mean;
}

export function calcMean(votes: number[]): number {
	if (!votes.length) return 0;

	return votes.reduce((p, c) => p + c) / votes.length;
}

export function calcMedian(votes: number[]): number {
	if (!votes.length) return 0;

	const sortedVotes = votes.sort((a, b) => a - b);

	const middle = Math.floor(sortedVotes.length / 2);

	if (sortedVotes.length % 2 === 0) {
		return (sortedVotes[middle - 1] + sortedVotes[middle]) / 2;
	}

	return sortedVotes[middle];
}

/* 
	Calculates the level of agreement among a group of estimations based 
	on the frequency of the most common estimation
*/
export function calculatePercentAgreed(estimations: number[]): number {
	if (!estimations.length) return 0;
	if (estimations.length === 1) return 1;

	const frequencyMap = new Map<number, number>();

	for (const estimation of estimations) {
		const estimationCount = frequencyMap.get(estimation);
		if (!estimationCount) {
			frequencyMap.set(estimation, 1);
			continue;
		}

		frequencyMap.set(estimation, estimationCount + 1);
	}

	const mostFrequentCount = Math.max(...frequencyMap.values());
	if (mostFrequentCount === 1) return 0;

	return mostFrequentCount / estimations.length;
}

/* 
	A modified version of the Coefficient of Variation (CV) method,
	which takes the standard deviation and mean into account. 
	By normalizing the standard deviation by the mean, we can capture the 
	relative variability of the estimates.
	
	Coefficient of variation (CV) is a math thing that helps us understand how spread out some numbers are. 
	It compares how much the numbers are different from each other (that's called "variability") to how big the 
	numbers are on average. If the numbers are very different from each other compared to how big they are on average, 
	the CV will be high. If the numbers are pretty similar to each other compared to how big they are on average, 
	the CV will be low.
*/
export function calculateCVNormilized(estimates: number[]): number {
	if (estimates.length < 2) return 1;

	const mean = estimates.reduce((sum, value) => sum + value, 0) / estimates.length;
	const variance =
		estimates.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / estimates.length;
	const standardDeviation = Math.sqrt(variance);
	const coefficientOfVariation = standardDeviation / mean;

	// Ensure the CV is within the range of [0, 1]
	const normalizedCV = Math.min(coefficientOfVariation, 1);

	return 1 - normalizedCV;
}

export function calculateAgreementLevel(estimates: number[]): number {
	let agreedWithEachOther = calculatePercentAgreed(estimates);
	const normalizedCV = calculateCVNormilized(estimates);

	// If there is no agreement, it affects agreement level too much
	// this allows us to smooth this effect
	agreedWithEachOther = Math.max(agreedWithEachOther, 0.1);

	return (agreedWithEachOther + normalizedCV) / 2;
}
