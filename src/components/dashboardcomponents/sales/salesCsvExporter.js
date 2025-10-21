
export const exportSalesToCSV = (sales) => {
    if (!sales.length) {
      alert("No sales data to export.");
      return;
    }
    
    const headers = [
      "S/N", 
      "Customer Name",
      "Customer Contact",
      "Delivery Address",
      "Product Type",
      "Quantity (kg)",
      "Price per Kg",
      "Delivery Cost",
      "Total Amount", // Calculated field
      "Payment Method",
      "Notes",
      "Date",
    ];
  
    // Define the structure of the data row, using functions for S/N and calculated fields.
    const keys = [
      // 1. S/N: This slot is  a placeholder function that uses the map index.
      (sale, index) => index + 1, 
      
      // 2. Standard fields (in API's snake_case)
      "customer_name",
      "customer_contact",
      "delivery_address",
      "product_type",
      "quantity",
      "price_per_kg",
      "delivery_cost",
      
      // 3. Calculated Total Amount (includes explicit number conversion)
      (sale) => {
        const quantity = Number(sale.quantity) || 0;
        const pricePerKg = Number(sale.price_per_kg) || 0;
        const deliveryCost = Number(sale.delivery_cost) || 0;
        return (quantity * pricePerKg + deliveryCost).toFixed(2);
      },
      
      // 4. Remaining standard fields
      "payment_method",
      "notes",
      (sale) => new Date(sale.date || sale.created_at).toLocaleDateString(),
    ];
  
    const csvRows = [
        headers.join(','),
        ...sales.map((sale, index) => 
          keys.map(key => {
            let value;
            if (typeof key === 'function') {
              // 1. Calculated or Index value (like S/N or Total Amount)
              value = key(sale, index); 
            } else {
              // 2. Standard field value
              value = sale[key] === undefined || sale[key] === null ? '' : sale[key];
            }
            
            // Ensure 'value' is a string before calling .replace()
            value = String(value);
    
            // CSV escaping logic (Now safe)
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
              return `"${value}"`;
            }
            return value;
          }).join(',')
        )
      ];
  
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `sales_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };