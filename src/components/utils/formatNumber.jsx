export const formatNumber = (value) => {
    return new Intl.NumberFormat('en-TZ', {
      maximumFractionDigits: 0
    }).format(value);
  };