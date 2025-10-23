import { Download } from "lucide-react";

const ExportCsvButton = ({ data, filenamePrefix }) => {
  const handleExportCsv = () => {
    if (!data || data.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = [
      "S/N",
      "Supplier",
      "Quantity (kg)",
      "Price per kg",
      "Transport Cost",
      "Total Cost",
      "Delivery Date",
      "Notes",
    ];

    const csvRows = data.map((order, index) => {
      const row = [
        index + 1,
        order.supplier,
        order.quantity,
        order.price_per_kg || order.pricePerKg,
        order.transport_cost || order.transportCost,
        order.total_cost || order.totalCost,
        new Date(order.delivery_date || order.deliveryDate).toLocaleDateString(),
        order.notes || "",
      ];

      return row
        .map((value) => {
          let strValue = String(value).replace(/"/g, '""');
          if (strValue.includes(",") || strValue.includes("\n") || strValue.includes('"')) {
            return `"${strValue}"`;
          }
          return strValue;
        })
        .join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filenamePrefix || "export"}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportCsv}
      className="flex items-center gap-2 py-1.5 px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors text-sm shadow-md"
      disabled={!data || data.length === 0}
    >
      <Download className="h-4 w-4" />
      <span>Export All</span>
    </button>
  );
};

export default ExportCsvButton;
