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

export function calcFleissKappa(votes: number[]): number {
	if (!votes.length) return 0;

	/*
	Suppose a team of four developers is estimating the time required to complete a task, using hours as the unit of measurement. The developers provide the following estimates: 3 hours, 4 hours, 2 hours, and 3 hours. To calculate Fleiss' kappa for this set of estimates, we would first need to define the categories that the team is using to make their estimations. In this case, the categories are simply the different integer values of hours that the developers have provided.

	Next, we would tally the number of times each developer chose each category.
	For example, if the team is estimating a single task, and the first developer estimated the task to take 3 hours, 
	the tally for the "3" category would be 1. We would repeat this process for each developer.

	Once we have the tallies, we can calculate Fleiss' kappa using the formula:

	kappa = (P - Pe) / (1 - Pe)

	where P is the observed agreement among the developers, and Pe is the expected agreement by chance.

	For this example, we have the following tallies:

	| Hours | Tally |
	|-------|-------|
	| 2     | 1     |
	| 3     | 2     |
	| 4     | 1     |

	We can calculate the total number of estimates as:

	n = 4 (developers) x 1 (task) = 4

	Next, we calculate the observed agreement among developers by summing the number of tallies for each category and dividing by the total number of estimates:

	P = (1 + 2 + 1) / 4 = 1

	To calculate the expected agreement by chance, we first calculate the proportion of estimates for each category:

	p2 = 1/4 = 0.25
	p3 = 2/4 = 0.5
	p4 = 1/4 = 0.25

	Next, we calculate the probability that any two developers would agree on an estimate by chance:

	Pe = (p2^2 + p3^2 + p4^2) = 0.375

	Finally, we can calculate Fleiss' kappa:

	kappa = (P - Pe) / (1 - Pe) = (0.5 - 0.375) / (1 - 0.375) = 0.29

	This indicates a fair level of agreement among the developers.
*/

	// 1. Count the number of times each developer chose each vote
	const tallies = new Map<number, number>();
	votes.forEach((vote) => {
		const tally = tallies.get(vote) || 0;
		tallies.set(vote, tally + 1);
	});

	// 2. Calculate the total number of estimates
	var n = votes.length;

	// 3. Calculate the observed agreement among developers
	const P = Array.from(tallies.values()).reduce((p, c) => p + c) / n;

	// 4. Calculate the expected agreement by chance
	const p = Array.from(tallies.values()).map((tally) => tally / n);

	// 5. Calculate the probability that any two developers would agree on an estimate by chance
	const Pe = p.reduce((p, c) => p + Math.pow(c, 2), 0);

	// 6. Calculate Fleiss' kappa
	return (P - Pe) / (1 - Pe);
}

export function calcIntraclassCorrelation(votes: number[]): number {
	/*
	Assuming that the estimates are from four different developers, we can calculate ICC using a one-way random effects model. 
	In this example, we have the following estimates: 2, 3, 4, and 3.

	First, we calculate the total sum of squares (SS_total):

	SS_total is a measure of the total variability in the estimates across all raters. It is calculated by summing the squared differences between each estimate and the overall mean estimate, across all raters. The formula for SS_total is:

	```
	SS_total = Σ (x_ij - x_bar)^2
	```

	where:
	-  x_ij is the estimate for the i-th rater on the j-th item/task
	-  x_bar is the overall mean estimate across all raters and items/tasks
	-  Σ is the sum across all raters and items/tasks

	To calculate SS_total for the example given earlier (estimates of 2, 3, 4, and 3), we first need to calculate the overall mean estimate, x_bar:

	```
	x_bar = (2 + 3 + 4 + 3) / 4
				= 3
	```

	Next, we calculate the squared differences between each estimate and x_bar, and sum them up:

	```
		SS_total = (2-3.0)^2 + (3-3.0)^2 + (4-3.0)^2 + (3-3.0)^2
						= 2.0
	```

	Therefore, the SS_total for these estimates is 2.0.

	SS_total represents the total amount of variability in the estimates, regardless of whether the variability is due to differences between raters or due to differences between the items/tasks being estimated. The other components of the ICC formula (SS_between and SS_within) are used to separate out the variability due to differences between raters and the variability due to differences between items/tasks, so that we can calculate a measure of agreement that is specific to the raters.

	Next, we calculate the between-group sum of squares (SS_between):

	```
	SS_between = [(2+3+4+3)/4 - 3.0]^2 * 4
						= 1.5
	```

	Finally, we calculate the within-group sum of squares (SS_within):

	```
	SS_within = SS_total - SS_between
						= 0.5
	```

	Using these values, we can calculate the ICC as:

	```
	ICC = (SS_between - SS_within) / (SS_total + SS_within)
			= (1.5 - 0.5) / (2.0 + 0.5)
			= 0.5
	```

	Therefore, the ICC for these estimates is 0.5, indicating moderate agreement between the developers.

	Interpretation:
		Cicchetti (1994) gives the following often quoted guidelines for interpretation for kappa or ICC inter-rater agreement measures:

		Less than 0.40—poor.
		Between 0.40 and 0.59—fair.
		Between 0.60 and 0.74—good.
		Between 0.75 and 1.00—excellent.
		A different guideline is given by Koo and Li (2016):[20]

		below 0.50: poor
		between 0.50 and 0.75: moderate
		between 0.75 and 0.90: good
		above 0.90: excellent
	*/
	if (!votes.length) {
		return 0;
	}

	// 1. Calculate the total sum of squares (SS_total)
	const x_bar = votes.reduce((p, c) => p + c) / votes.length; // aka the overall mean estimate
	const SS_total = votes.reduce((p, c) => p + Math.pow(c - x_bar, 2), 0);

	// 2. Calculate the between-group sum of squares (SS_between)
	const SS_between =
		Math.pow(votes.reduce((p, c) => p + c, 0) / votes.length - x_bar, 2) * votes.length;

	// 3. Calculate the within-group sum of squares (SS_within)
	const SS_within = SS_total - SS_between;

	// 4. Calculate the ICC
	return (SS_between - SS_within) / (SS_total + SS_within);
}

/*
Kendall's W is a measure of agreement or concordance between multiple raters or observers.
It ranges from -1 to 1, where:
	•	A value of 1 indicates perfect agreement between all raters.
	•	A value of 0 indicates no agreement between the raters, or agreement that is no better than chance.
	•	A value of -1 indicates perfect disagreement between all raters.
*/
export function kendallsW(estimations: number[]): number {
	const n = estimations.length; // number of developers
	if (n <= 1) return 0;

	let s = 0; // sum of signed differences between all pairs of developers

	// Loop through all pairs of developers
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const a = estimations[i];
			const b = estimations[j];
			if (a === b) continue;

			if (a < b) {
				s++;
			} else {
				s--;
			}
		}
	}

	// Calculate Kendall's W
	const numerator = 2 * s;
	const denominator = n * (n - 1);
	const w = numerator / denominator;

	return w;
}

export function kendallsW2(estimations: number[]): number {
	// Convert estimations to ranks
	const uniqueEstimations = Array.from(new Set(estimations)).sort((a, b) => a - b);
	const ranks = [estimations.map((estimation) => uniqueEstimations.indexOf(estimation) + 1)];

	const m = ranks.length; // number of developers (raters)
	const n = ranks[0].length; // number of tasks (only one task in your case)

	// Calculate the sum of squared deviations (S) from the mean rank for each task
	const meanRank = (m * (n + 1)) / 2;
	const S = ranks
		.map((rank) => rank.map((r) => Math.pow(r - meanRank, 2)))
		.reduce((sum, current) => sum + current.reduce((a, b) => a + b, 0), 0);

	// Calculate the maximum possible sum of squared deviations (Smax)
	const Smax = (m * Math.pow(n, 2) * (n - 1)) / 12;

	// Calculate Kendall's W
	const W = 1 - S / Smax;

	return W;
}

/*
	To calculate the IQR, you first need to sort the estimates in ascending order: 2, 3, 3, 4.
	Then, you find the median of the data set, which is the middle value: 3.
	Next, you find the median of the lower half of the data set (the values less than or equal to the median), which is 2.5.
	Finally, you find the median of the upper half of the data set (the values greater than or equal to the median), 
	which is 3.5. The IQR is the difference between the upper and lower quartiles: 3.5 - 2.5 = 1.
	The IQR provides a measure of the spread of the data and can be used as a rough indicator of agreement.
	In this case, the IQR is relatively small (1 hour),
	which suggests that the developers are in moderate agreement about the estimated time to complete the task.
	However, it is important to note that the IQR is not a formal statistical measure of agreement and 
	does not take into account the level of agreement that could be expected by chance.
*/
export function calcInterquartileRange(values: number[]): number {
	if (values.length < 2) return 0;

	// Sort the values in ascending order
	const sorted = values.sort((a, b) => a - b);
	// Find the median of the data set
	const medianIdx = Math.floor(sorted.length / 2);
	// Find the median of the lower half of the data set
	const lowerHalfMedian = calcMedian(sorted.slice(0, medianIdx));
	// Find the median of the upper half of the data set
	const upperHalfMedian = calcMedian(sorted.slice(medianIdx));
	// Calculate the IQR
	return upperHalfMedian - lowerHalfMedian;
}

export function calculateAgreementLevel(estimations: number[]): number {
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

// // Example usage:
// const estimations = [2, 3, 4, 3];
// const agreementLevel = calculateAverageDeviation(estimations);
// console.log(agreementLevel); // Output: 0.5
export function calculateAgreementLevel2(estimations: number[]): number {
	if (!estimations.length) return 1;
	// Calculate the mean of the estimations
	const mean = estimations.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the absolute differences between each estimation and the mean
	const absoluteDifferences = estimations.map((estimation) => Math.abs(estimation - mean));

	// Calculate the average deviation
	const averageDeviation =
		absoluteDifferences.reduce((sum, current) => sum + current, 0) / estimations.length;
	// Everyone agreed!
	if (averageDeviation === 0) return 1;

	// Calculate the max possible deviation (equal to the range of the estimations)
	const maxPossibleDeviation = Math.max(...estimations) - Math.min(...estimations);

	// Normalize the average deviation
	const normalizedAverageDeviation = averageDeviation / maxPossibleDeviation;

	// Calculate the agreement level
	const agreementLevel = 1 - normalizedAverageDeviation;

	return agreementLevel;
}

export function calculateAgreementLevel3(estimations: number[]): number {
	// Calculate the mean of the estimations
	const mean = estimations.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the squared differences between each estimation and the mean
	const squaredDifferences = estimations.map((estimation) => Math.pow(estimation - mean, 2));

	// Calculate the variance
	const variance =
		squaredDifferences.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the standard deviation
	const standardDeviation = Math.sqrt(variance);
	// Everyone agreed!
	if (standardDeviation === 0) return 1;

	// Calculate the max possible standard deviation (equal to half of the range of the estimations)
	const maxPossibleStandardDeviation = (Math.max(...estimations) - Math.min(...estimations)) / 2;

	// Normalize the standard deviation
	const normalizedStandardDeviation = standardDeviation / maxPossibleStandardDeviation;

	// Calculate the agreement level
	const agreementLevel = 1 - normalizedStandardDeviation;

	return agreementLevel;
}

export function calculateAgreementLevel4(estimations: number[]): number {
	// Calculate the mean of the estimations
	const mean = estimations.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the absolute differences between each estimation and the mean
	const absoluteDifferences = estimations.map((estimation) => Math.abs(estimation - mean));

	// Calculate the average absolute deviation
	const averageAbsoluteDeviation =
		absoluteDifferences.reduce((sum, current) => sum + current, 0) / estimations.length;
	// Everyone agreed!
	if (averageAbsoluteDeviation === 0) return 1;

	// Calculate the max possible absolute deviation (equal to half of the range of the estimations)
	const maxPossibleAbsoluteDeviation = (Math.max(...estimations) - Math.min(...estimations)) / 2;

	// Normalize the average absolute deviation
	const normalizedAverageAbsoluteDeviation =
		averageAbsoluteDeviation / maxPossibleAbsoluteDeviation;

	// Calculate the agreement level
	const agreementLevel = 1 - normalizedAverageAbsoluteDeviation;

	return agreementLevel;
}

export function calculateAgreementLevelNew(estimations: number[]): number {
	// Calculate the mean of the estimations
	const mean = estimations.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the absolute differences between each estimation and the mean
	const absoluteDifferences = estimations.map((estimation) => Math.abs(estimation - mean));

	// Calculate the average absolute deviation
	const averageAbsoluteDeviation =
		absoluteDifferences.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the max possible sum of absolute deviations using the maximum and minimum values in the estimations
	const maxEstimation = Math.max(...estimations);
	const minEstimation = Math.min(...estimations);
	const maxPossibleSumAbsoluteDeviation = estimations.length * (maxEstimation - minEstimation);

	// Normalize the average absolute deviation
	const normalizedAverageAbsoluteDeviation =
		averageAbsoluteDeviation / (maxPossibleSumAbsoluteDeviation / estimations.length);

	// Calculate the agreement level
	const agreementLevel = 1 - normalizedAverageAbsoluteDeviation;

	return agreementLevel;
}

export function calculateAgreementLevel5(estimates: number[]): number {
	if (estimates.length === 0) return 0;

	const mean = estimates.reduce((sum, value) => sum + value, 0) / estimates.length;
	const variance =
		estimates.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / estimates.length;
	const stdDev = Math.sqrt(variance);
	const cv = stdDev / mean;
	return 1 - cv / (1 + cv);
}

export function calculateAgreementLevel6(estimations: number[]): number {
	if (!estimations.length) return 1;
	// Calculate the mean of the estimations
	const mean = estimations.reduce((sum, current) => sum + current, 0) / estimations.length;

	// Calculate the absolute differences between each estimation and the mean
	const absoluteDifferences = estimations.map((estimation) => Math.abs(estimation - mean));

	// Calculate the average deviation
	const averageDeviation =
		absoluteDifferences.reduce((sum, current) => sum + current, 0) / estimations.length;
	// Everyone agreed!
	if (averageDeviation === 0) return 1;

	// Calculate the max possible deviation (equal to the range of the estimations)
	const maxPossibleDeviation = (Math.max(...estimations) - Math.min(...estimations)) / 2;

	// Calculate the agreement level
	const agreementLevel = 1 - averageDeviation / maxPossibleDeviation;

	return agreementLevel;
}

// calculates Normalized Range using IQR for max possible range
export function calculateAgreementLevel7(estimates: number[]): number {
	if (estimates.length < 2) {
		return 1;
	}

	estimates.sort((a, b) => a - b);

	const median = (arr: number[]): number => {
		const mid = Math.floor(arr.length / 2);
		return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
	};

	const q1 = median(estimates.slice(0, Math.floor(estimates.length / 2)));
	const q3 = median(estimates.slice(Math.ceil(estimates.length / 2)));
	const iqr = q3 - q1;
	// everyone agreed
	if (iqr === 0) return 1;

	const lowerBound = q1 - 1.5 * iqr;
	const upperBound = q3 + 1.5 * iqr;

	const range = estimates[estimates.length - 1] - estimates[0];
	const maxPossibleRange = upperBound - lowerBound;

	const normalizedRange = range / maxPossibleRange;

	return 1 - normalizedRange;
}

/* 
	A modified version of the Coefficient of Variation (CV) method,
	which takes the standard deviation and mean into account. 
	By normalizing the standard deviation by the mean, we can capture the 
	relative variability of the estimates.
*/
export function calculateAgreementLevel8(estimates: number[]): number {
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
