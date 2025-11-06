import { DollarSign, Archive, Package } from "lucide-react"

// Function to generate KPI data dynamically
export const getKPIData = ({ totals, maize, flour, bran }) => {


  return [
    {
      title: "Total Revenue",
      value: `Tsh ${totals.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Cost",
      value: `Tsh ${totals.totalCost.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-red-500",
    },
    {
      title: "Total Maize Received",
      value: `${maize.toLocaleString()} kg`,
      icon: Archive,
      color: "bg-yellow-500",
    },
    {
      title: "Total Flour Produced",
      value: `${flour.toLocaleString()} kg`,
      icon: Package,
      color: "bg-orange-500",
    },
    {
      title: "Total Bran Produced",
      value: `${bran.toLocaleString()} kg`,
      icon: Package,
      color: "bg-purple-500",
    },
  ]
}
