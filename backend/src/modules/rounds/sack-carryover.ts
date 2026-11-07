export type FlourSackSize = 5 | 10 | 25;

export interface SackCarryover {
  sack_size: FlourSackSize;
  quantity: number;
}

export function calculateSackCarryover(
  openingBySize: Record<FlourSackSize, number>,
  purchasedBySize: Record<FlourSackSize, number>,
  usedBySize: Record<FlourSackSize, number>,
): SackCarryover[] {
  return ([5, 10, 25] as const)
    .map((size) => ({
      sack_size: size,
      quantity: Math.max(0, Math.floor(openingBySize[size] + purchasedBySize[size] - usedBySize[size])),
    }))
    .filter((item) => item.quantity > 0);
}
