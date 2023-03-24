import { expect, test } from 'vitest';

import { calcCoefficientOfVariation, calStdDeviation, maxVote, minVote } from './votes_stat';

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
