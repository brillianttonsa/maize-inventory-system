export interface CurrentStocks {
  maize: number;
  flour: number;
  bran: number;
  sacks5kg: number;
  sacks10kg: number;
  sacks25kg: number;
  electricityUnits: number;
}

export interface SackProductionBalance {
  size: 5 | 10 | 25;
  produced: number;
  sold: number;
  remaining: number;
}
