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
