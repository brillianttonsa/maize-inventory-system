export const formatNumber = (value: number | string): string => {
  return new Intl.NumberFormat('en-TZ', {
    maximumFractionDigits: 0,
  }).format(Number(value));
};
