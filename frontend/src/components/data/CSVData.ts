const formatCsvDate = (value: string | Date | null | undefined): string => {
  if (!value) return '';
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
};

export const PROCUREMENT_HEADERS = [
  'S/N',
  'Supplier',
  'Quantity (tons)',
  'Price per kg',
  'Transport Cost',
  'Total Cost',
  'Delivery Date',
];

export const procurementDataMapper = (order: any, index: number) => [
  index + 1,
  order.supplier,
  Number(order.quantity) / 1000,
  order.price_per_kg,
  order.transport_cost,
  order.total_cost,
  order.delivery_date,
];

export const PRODUCTION_HEADERS = [
  'S/N',
  'Date',
  'Maize Quantity (tons)',
  'Flour 5 kg Sacks',
  'Flour 10 kg Sacks',
  'Flour 25 kg Sacks',
  'Flour Output (kg)',
  'Bran Output (gunia)',
];

export const productionDataMapper = (batch: any, index: number) => [
  index + 1,
  batch.date,
  batch.maize_quantity / 1000,
  batch.flour_sacks_5kg,
  batch.flour_sacks_10kg,
  batch.flour_sacks_25kg,
  batch.flour_output,
  batch.bran_debe_quantity ? Number(batch.bran_debe_quantity) / 7 : '',
];

export const SALES_HEADERS = [
  'S/N',
  'Customer Name',
  'Customer Contact',
  'Delivery Address',
  'Product Type',
  'Quantity (kg/debe)',
  'Flour Sack Count',
  'Flour Sack Size (kg)',
  'Bran Quantity (gunia)',
  'Price per Kg',
  'Delivery Cost',
  'Total Amount',
  'Payment Method',
  'Date',
];

export const salesDataMapper = (sale: any, index: number) => [
  index + 1,
  sale.customer_name,
  sale.customer_contact,
  sale.delivery_address,
  sale.product_type,
  sale.quantity,
  sale.sack_count ?? '',
  sale.sack_size ?? '',
  sale.bran_unit_count ?? '',
  sale.price_per_kg,
  sale.delivery_cost,
  sale.total_amount,
  sale.payment_method,
  sale.date,
];

export const EXPENSE_HEADERS = [
  'S/N',
  'Date',
  'Category',
  'Quantity/Units',
  'Unit Cost (TSh)',
  'Sack Size (kg)',
  'Amount (TSh)',
  'Paid By',
  'Method',
  'notes',
];

export const expenseDataMapper = (expense: any, index: number) => [
  index + 1,
  expense.date,
  expense.category,
  expense.unit_value,
  expense.unit_cost ?? '',
  expense.sack_size ?? '',
  expense.amount,
  expense.paid_by,
  expense.method,
  expense.notes || '',
];

export const INVENTORY_HEADERS = [
  'S/N',
  'Date',
  'Item',
  'Quantity In',
  'Quantity Out',
  'Source/Destination',
  'Balance',
  'Remarks',
];

export const inventoryDataMapper = (inventory: any, index: number) => [
  index + 1,
  inventory.date,
  inventory.item,
  inventory.quantityIn,
  inventory.quantityOut,
  inventory.source || inventory.destination || '',
  inventory.balance ?? 0,
  inventory.remarks || '',
];
