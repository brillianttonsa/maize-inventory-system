export const PROCUREMENT_HEADERS = [
    "S/N",
    "Supplier",
    "Quantity (kg)",
    "Price per kg",
    "Transport Cost",
    "Total Cost",
    "Delivery Date",
    "Notes",
];
  
export const procurementDataMapper = (order, index) =>  [
    index + 1,
    order.supplier,
    order.quantity,
    order.price_per_kg,
    order.transport_cost,
    order.total_cost,
    order.delivery_date ,
    order.notes || "",
];

export const PRODUCTION_HEADERS = [
    "S/N", "Date", "Maize Quantity (kg)", "Flour Output (kg)", 
    "Bran Output (kg)", "Water Usage (L)", "Electricity Usage (kWh)", 
    "Sacks Used", "Employee Notes",
  ];

export const productionDataMapper = (batch, index) => [
    index + 1,
    batch.date,
    batch.maize_quantity,
    batch.flour_output,
    batch.bran_output,
    batch.water_usage,
    batch.electricity_usage,
    batch.sacks_used,
    batch.notes || "",
  ];

  export const SALES_HEADERS = [
    "S/N", 
    "Customer Name",
    "Customer Contact",
    "Delivery Address",
    "Product Type",
    "Quantity (kg)",
    "Price per Kg",
    "Delivery Cost",
    "Total Amount", 
    "Payment Method",
    "Notes",
    "Date",
  ];

  export const salesDataMapper = (sale, index) => [
    index + 1,
    sale.customer_name,
    sale.customer_contact,
    sale.delivery_address,
    sale.product_type,
    sale.quantity,
    sale.price_per_kg,
    sale.delivery_cost,
    sale.total_amount,
    sale.payment_method,
    sale.notes || "",
    sale.date
  ]

export const EXPENSE_HEADERS = [
  "S/N", "Date", "Category", "Quantity/Units", "Amount (TSh)", 
  "Paid By", "Method", "notes" 
];

export const expenseDataMapper = (expense, index) => [
  index + 1, // S/N
  expense.date,
  expense.category,
  expense.unit_value, 
  expense.amount,
  expense.paid_by,
  expense.method,
]

