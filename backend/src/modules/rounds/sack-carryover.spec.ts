import { calculateSackCarryover } from './sack-carryover';

describe('calculateSackCarryover', () => {
  it('carries forward remaining sacks by package size', () => {
    expect(
      calculateSackCarryover(
        { 5: 10, 10: 2, 25: 0 },
        { 5: 20, 10: 5, 25: 4 },
        { 5: 17, 10: 4, 25: 1 },
      ),
    ).toEqual([
      { sack_size: 5, quantity: 13 },
      { sack_size: 10, quantity: 3 },
      { sack_size: 25, quantity: 3 },
    ]);
  });

  it('does not carry over negative stock or empty sizes', () => {
    expect(
      calculateSackCarryover(
        { 5: 0, 10: 0, 25: 1 },
        { 5: 0, 10: 0, 25: 2 },
        { 5: 1, 10: 0, 25: 9 },
      ),
    ).toEqual([]);
  });
});
