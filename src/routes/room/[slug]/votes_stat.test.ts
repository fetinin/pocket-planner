import { describe, expect, test } from 'vitest';

import * as votes_stat from './votes_stat';

test('minVote()', () => {
	expect(votes_stat.minVote([0, 3, 20])).toBe(0);
	expect(votes_stat.minVote([20, 10, 50])).toBe(10);
});

test('maxVote()', () => {
	expect(votes_stat.maxVote([0, 3, 20])).toBe(20);
	expect(votes_stat.maxVote([20, 10, 50])).toBe(50);
});

test('calStdDeviation()', () => {
	expect(votes_stat.calStdDeviation([1, 3, 1])).toBeCloseTo(0.94, 2);
	expect(votes_stat.calStdDeviation([10, 12, 10, 8])).toBeCloseTo(1.41, 2);
	expect(votes_stat.calStdDeviation([20, 10, 50])).toBeCloseTo(17, 2);
	expect(votes_stat.calStdDeviation([3, 8, 10, 3])).toBeCloseTo(3.08, 2);
	expect(votes_stat.calStdDeviation([10, 10, 10])).toBe(0);
	expect(votes_stat.calStdDeviation([1, 5, 6, 8, 10, 40, 65, 88])).toBeCloseTo(30.779, 2);
});

test('calcCoefficientOfVariation()', () => {
	expect(votes_stat.calcCoefficientOfVariation([1, 3, 1])).toBeCloseTo(0.57, 2);
	expect(votes_stat.calcCoefficientOfVariation([10, 12, 10, 8])).toBeCloseTo(0.14, 2);
	expect(votes_stat.calcCoefficientOfVariation([20, 10, 50])).toBeCloseTo(0.64, 2);
	expect(votes_stat.calcCoefficientOfVariation([3, 8, 10, 3])).toBeCloseTo(0.51, 2);
	expect(votes_stat.calcCoefficientOfVariation([10, 10, 10])).toBe(0);
	expect(votes_stat.calcCoefficientOfVariation([10, 10, 12])).toBeCloseTo(0.088, 2);
	expect(votes_stat.calcCoefficientOfVariation([1, 5, 6, 8, 10, 40, 65, 88])).toBeCloseTo(1.1, 2);
});

test('calcMedian', () => {
	expect(votes_stat.calcMedian([])).toBe(0);
	expect(votes_stat.calcMedian([3])).toBe(3);
	expect(votes_stat.calcMedian([3, 3])).toBe(3);
	expect(votes_stat.calcMedian([2, 3, 3])).toBe(3);
	expect(votes_stat.calcMedian([3, 3, 4])).toBe(3);
	expect(votes_stat.calcMedian([2, 3, 3, 4])).toBe(3);
	expect(votes_stat.calcMedian([2, 3, 4, 4])).toBe(3.5);
	expect(votes_stat.calcMedian([3, 3, 4, 5])).toBe(3.5);
	expect(votes_stat.calcMedian([3, 4, 4, 5])).toBe(4);
	expect(votes_stat.calcMedian([3, 4, 5, 5])).toBe(4.5);
	expect(votes_stat.calcMedian([4, 4, 4, 4])).toBe(4);
	expect(votes_stat.calcMedian([4, 4, 4, 5])).toBe(4);
	expect(votes_stat.calcMedian([4, 4, 5, 5])).toBe(4.5);
	expect(votes_stat.calcMedian([5, 5, 5, 5])).toBe(5);
	expect(votes_stat.calcMedian([24.1, 24.7, 25.0, 25.2, 25.6, 25.7, 26.1, 27.8])).toBeCloseTo(
		25.4,
		2
	);
});

test('calcMean', () => {
	expect(votes_stat.calcMean([])).toBe(0);
	expect(votes_stat.calcMean([3])).toBe(3);
	expect(votes_stat.calcMean([3, 3])).toBe(3);
	expect(votes_stat.calcMean([2, 3, 3])).toBeCloseTo(2.66, 1);
	expect(votes_stat.calcMean([3, 3, 4])).toBeCloseTo(3.33, 2);
	expect(votes_stat.calcMean([2, 3, 3, 4])).toBe(3);
	expect(votes_stat.calcMean([2, 3, 4, 4])).toBeCloseTo(3.25, 2);
	expect(votes_stat.calcMean([3, 3, 4, 5])).toBeCloseTo(3.75);
	expect(votes_stat.calcMean([3, 4, 4, 5])).toBe(4);
	expect(votes_stat.calcMean([3, 4, 5, 5])).toBeCloseTo(4.25, 2);
	expect(votes_stat.calcMean([4, 4, 4, 4])).toBe(4);
	expect(votes_stat.calcMean([4, 4, 4, 5])).toBeCloseTo(4.25, 2);
	expect(votes_stat.calcMean([4, 4, 5, 5])).toBe(4.5);
	expect(votes_stat.calcMean([5, 5, 5, 5])).toBe(5);
	expect(votes_stat.calcMean([24.1, 24.7, 25.0, 25.2, 25.6, 25.7, 26.1, 27.8])).toBeCloseTo(
		25.52,
		2
	);
});

test('calcInterquartileRange', () => {
	expect(votes_stat.calcInterquartileRange([])).toBe(0);
	expect(votes_stat.calcInterquartileRange([3])).toBe(0);
	expect(votes_stat.calcInterquartileRange([3, 3])).toBe(0);
	expect(votes_stat.calcInterquartileRange([2, 3, 3])).toBe(1);
	expect(votes_stat.calcInterquartileRange([2, 3, 3, 4])).toBe(1);
});

describe('calculates agreement level correctly', () => {
	describe('estimations = [2, 3, 4, 3]', () => {
		const estimations = [2, 3, 4, 3];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0.5);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.76, 2);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.63, 1);
		});
	});

	describe('everyone agreed', () => {
		const estimations = [1, 1, 1, 1];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(1);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBe(1);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBe(1);
		});
	});

	describe('No one agreed, votes are not far spread apart', () => {
		const estimations = [1, 2, 3, 4];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.55, 2);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.27, 1);
		});
	});

	describe('Voters estimations are split into two groups', () => {
		const estimations = [2, 2, 4, 4];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0.5);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.666, 2);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.58, 2);
		});
	});

	describe('Everyone agreed except one', () => {
		const estimations = [6, 6, 6, 8];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0.75);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.866, 2);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.78, 1);
		});
	});

	describe('Everyone agreed except one, who is strongly disagreed', () => {
		const estimations = [6, 6, 6, 20];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0.75);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.36, 2);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.55, 1);
		});
	});

	describe('Single vote', () => {
		const estimations = [4];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(1);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBe(1);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBe(1);
		});
	});

	describe('Two voters disagreed', () => {
		const estimations = [4, 6];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBe(0.8);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBe(0.4);
		});
	});

	describe('Four voters disagreed', () => {
		const estimations = [4, 8, 6, 12];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.6, 1);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.3, 1);
		});
	});

	describe('One thought this will take less, one disagreed', () => {
		const estimations = [8, 8, 6, 16];
		test('calc agreement percent', ({ expect }) => {
			expect(votes_stat.calculatePercentAgreed(estimations)).toBe(0.5);
		});
		test('calc normilized CV', ({ expect }) => {
			expect(votes_stat.calculateCVNormilized(estimations)).toBeCloseTo(0.6, 1);
		});
		test('calc agreement level', ({ expect }) => {
			expect(votes_stat.calculateAgreementLevel(estimations)).toBeCloseTo(0.54, 1);
		});
	});
});
