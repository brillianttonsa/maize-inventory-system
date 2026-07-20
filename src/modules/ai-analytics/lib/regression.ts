export interface DailyPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
}

/**
 * Ordinary least squares fit over (index, value) pairs.
 * x is just the day index (0, 1, 2 ...), not the calendar date itself —
 * this is a simple trend line, not a seasonal model.
 */
export function fitLinearRegression(points: number[]): RegressionResult {
  const n = points.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  if (n === 1) return { slope: 0, intercept: points[0] };

  const xs = points.map((_, i) => i);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = points.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * points[i], 0);
  const sumXX = xs.reduce((acc, x) => acc + x * x, 0);

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export function predictNext(regression: RegressionResult, stepsAhead: number): number {
  return Math.max(0, regression.slope * stepsAhead + regression.intercept);
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Buckets records into a dense daily series between the earliest record and today,
 * filling gaps with 0 so a regression isn't skewed by missing days.
 */
export function buildDailySeries(
  records: Array<{ date: string; value: number }>,
): DailyPoint[] {
  if (records.length === 0) return [];

  const totalsByDate = new Map<string, number>();
  records.forEach((r) => {
    const key = toISODate(new Date(r.date));
    totalsByDate.set(key, (totalsByDate.get(key) || 0) + r.value);
  });

  const dates = Array.from(totalsByDate.keys()).sort();
  const start = new Date(dates[0]);
  const end = new Date(dates[dates.length - 1]);

  const series: DailyPoint[] = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const key = toISODate(d);
    series.push({ date: key, value: totalsByDate.get(key) || 0 });
  }

  return series;
}

export const MIN_DATA_POINTS = 7;
