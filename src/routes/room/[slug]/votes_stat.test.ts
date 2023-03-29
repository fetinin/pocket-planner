import { expect, test } from 'vitest';

import {
	calcCoefficientOfVariation,
	calcInterquartileRange,
	calcMean,
	calcMedian,
	calStdDeviation,
	maxVote,
	minVote
} from './votes_stat';

test('minVote()', () => {
	expect(minVote([0, 3, 20])).toBe(0);
	expect(minVote([20, 10, 50])).toBe(10);
});

test('maxVote()', () => {
	expect(maxVote([0, 3, 20])).toBe(20);
	expect(maxVote([20, 10, 50])).toBe(50);
});

test('calStdDeviation()', () => {
	expect(calStdDeviation([1, 3, 1])).toBeCloseTo(0.94, 2);
	expect(calStdDeviation([10, 12, 10, 8])).toBeCloseTo(1.41, 2);
	expect(calStdDeviation([20, 10, 50])).toBeCloseTo(17, 2);
	expect(calStdDeviation([3, 8, 10, 3])).toBeCloseTo(3.08, 2);
	expect(calStdDeviation([10, 10, 10])).toBe(0);
	expect(calStdDeviation([1, 5, 6, 8, 10, 40, 65, 88])).toBeCloseTo(30.779, 2);
});

test('calcCoefficientOfVariation()', () => {
	expect(calcCoefficientOfVariation([1, 3, 1])).toBeCloseTo(0.57, 2);
	expect(calcCoefficientOfVariation([10, 12, 10, 8])).toBeCloseTo(0.14, 2);
	expect(calcCoefficientOfVariation([20, 10, 50])).toBeCloseTo(0.64, 2);
	expect(calcCoefficientOfVariation([3, 8, 10, 3])).toBeCloseTo(0.51, 2);
	expect(calcCoefficientOfVariation([10, 10, 10])).toBe(0);
	expect(calcCoefficientOfVariation([10, 10, 12])).toBeCloseTo(0.088, 2);
	expect(calcCoefficientOfVariation([1, 5, 6, 8, 10, 40, 65, 88])).toBeCloseTo(1.1, 2);
});

test('calcMedian', () => {
	expect(calcMedian([])).toBe(0);
	expect(calcMedian([3])).toBe(3);
	expect(calcMedian([3, 3])).toBe(3);
	expect(calcMedian([2, 3, 3])).toBe(3);
	expect(calcMedian([3, 3, 4])).toBe(3);
	expect(calcMedian([2, 3, 3, 4])).toBe(3);
	expect(calcMedian([2, 3, 4, 4])).toBe(3.5);
	expect(calcMedian([3, 3, 4, 5])).toBe(3.5);
	expect(calcMedian([3, 4, 4, 5])).toBe(4);
	expect(calcMedian([3, 4, 5, 5])).toBe(4.5);
	expect(calcMedian([4, 4, 4, 4])).toBe(4);
	expect(calcMedian([4, 4, 4, 5])).toBe(4);
	expect(calcMedian([4, 4, 5, 5])).toBe(4.5);
	expect(calcMedian([5, 5, 5, 5])).toBe(5);
	expect(calcMedian([24.1, 24.7, 25.0, 25.2, 25.6, 25.7, 26.1, 27.8])).toBeCloseTo(25.4, 2);
});

test('calcMean', () => {
	expect(calcMean([])).toBe(0);
	expect(calcMean([3])).toBe(3);
	expect(calcMean([3, 3])).toBe(3);
	expect(calcMean([2, 3, 3])).toBeCloseTo(2.66, 1);
	expect(calcMean([3, 3, 4])).toBeCloseTo(3.33, 2);
	expect(calcMean([2, 3, 3, 4])).toBe(3);
	expect(calcMean([2, 3, 4, 4])).toBeCloseTo(3.25, 2);
	expect(calcMean([3, 3, 4, 5])).toBeCloseTo(3.75);
	expect(calcMean([3, 4, 4, 5])).toBe(4);
	expect(calcMean([3, 4, 5, 5])).toBeCloseTo(4.25, 2);
	expect(calcMean([4, 4, 4, 4])).toBe(4);
	expect(calcMean([4, 4, 4, 5])).toBeCloseTo(4.25, 2);
	expect(calcMean([4, 4, 5, 5])).toBe(4.5);
	expect(calcMean([5, 5, 5, 5])).toBe(5);
	expect(calcMean([24.1, 24.7, 25.0, 25.2, 25.6, 25.7, 26.1, 27.8])).toBeCloseTo(25.52, 2);
});

test('calcInterquartileRange', () => {
	expect(calcInterquartileRange([])).toBe(0);
	expect(calcInterquartileRange([3])).toBe(0);
	expect(calcInterquartileRange([3, 3])).toBe(0);
	expect(calcInterquartileRange([2, 3, 3])).toBe(1);
	expect(calcInterquartileRange([2, 3, 3, 4])).toBe(1);
});

// test('calcFleissKappa', () => {
// 	expect(calcFleissKappa([])).toBe(0);
// 	expect(calcFleissKappa([3, 4, 2, 3])).toBe(0.29);
// });

// test('calcIntraclassCorrelation', () => {
// 	expect(calcIntraclassCorrelation([])).toBe(0);
// 	expect(calcIntraclassCorrelation([3, 4, 2, 3])).toBe(0.5);
// });

// test('kendallsW', () => {
// 	// expect(kendallsW([2, 3, 3, 4])).toBeCloseTo(0.83, 2);
// 	// expect(kendallsW([3, 3, 3, 3])).toBe(1);
// 	expect(kendallsW([2, 3, 3, 2])).toBe(1);
// });
