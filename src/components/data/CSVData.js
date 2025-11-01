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
    order.price_per_kg || order.pricePerKg,
    order.transport_cost || order.transportCost,
    order.total_cost || order.totalCost,
    new Date(order.delivery_date || order.deliveryDate).toLocaleDateString(),
    order.notes || "",
];