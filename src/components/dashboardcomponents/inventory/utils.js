// utils.js
export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-TZ', {
    maximumFractionDigits: 0,
  }).format(value);
};
