import api from "./api";

// Fetch all production data for the user
export const getProductionStats = async () => {
  try {
    const res = await api.get(`/production`);
    const data = res.data;

    const totalMaize = data.reduce((sum, p) => sum + Number(p.maize_quantity || 0), 0);
    const totalFlour = data.reduce((sum, p) => sum + Number(p.flour_output || 0), 0);
    const totalBran = data.reduce((sum, p) => sum + Number(p.bran_output || 0), 0);

    const efficiency = totalMaize > 0 
      ? ((totalFlour + totalBran) / totalMaize * 100).toFixed(2) 
      : 0;

    return { totalMaize, totalFlour, totalBran, efficiency };
  } catch (err) {
    console.error("Failed to fetch production stats:", err);
    return { totalMaize: 0, totalFlour: 0, totalBran: 0, efficiency: 0 };
  }
};

// Fetch total revenue for the user
export const getRevenueStats = async () => {
  try {
    const res = await api.get(`/sales`);
    const data = res.data;

    // Sum total_amount from all sales
    const totalRevenue = data.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);

    return { totalRevenue };
  } catch (err) {
    console.error("Failed to fetch revenue stats:", err);
    return { totalRevenue: 0 };
  }
};
