// constants.js
export const PRIMARY_TEXT = 'text-yellow-700';
export const ALERT_RED = 'border-red-500 bg-red-50';
export const ALERT_YELLOW = 'border-amber-500 bg-amber-50';
export const ALERT_GREEN = 'border-green-500 bg-green-50';

export const COLORS = {
  maize: '#FFD700',
  flour: '#D97706',
  bran: '#A16207',
  sacks: '#10B981',
};

export const INITIAL_STOCK = {
  maize: 2500,
  flour: 800,
  bran: 400,
  sacks: 150,
};

export const UNIT_VALUES = {
  maize: 400,
  flour: 600,
  bran: 200,
  sacks: 50,
};

export const INITIAL_MOVEMENTS = [
  { id: 1, date: '2025-10-10', item: 'Maize', quantityIn: 5000, quantityOut: 0, unit: 'kg', source: 'Supplier A', destination: 'Stock', balance: 5000, remarks: 'New Procurement' },
  { id: 2, date: '2025-10-11', item: 'Maize', quantityIn: 0, quantityOut: 1500, unit: 'kg', source: 'Stock', destination: 'Milling Line', balance: 3500, remarks: 'Start of Production Batch' },
  { id: 3, date: '2025-10-11', item: 'Flour', quantityIn: 900, quantityOut: 0, unit: 'kg', source: 'Milling Line', destination: 'Stock', balance: 900, remarks: 'Production Yield' },
  // ...
];
