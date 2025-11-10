
export function calculateCurrentStocks({ procurements = [], productions = [], sales = [], expenses = [] }) {
    // Maize = total procured − total used in production
    const totalMaizeProcured = procurements.reduce((sum, p) => sum + Number(p.quantity), 0);
    const totalMaizeUsed = productions.reduce((sum, p) => sum + Number(p.maize_quantity || 0), 0);
  
    // Flour = total produced − total sold
    const totalFlourProduced = productions.reduce((sum, p) => sum + Number(p.flour_output || 0), 0);
    const totalFlourSold = sales
      .filter(s => s.product_type.toLowerCase() === "flour")
      .reduce((sum, s) => sum + Number(s.quantity || 0), 0);
  
    // Bran = total produced − total sold
    const totalBranProduced = productions.reduce((sum, p) => sum + Number(p.bran_output || 0), 0);
    const totalBranSold = sales
      .filter(s => s.product_type.toLowerCase() === "bran")
      .reduce((sum, s) => sum + Number(s.quantity || 0), 0);
  
    // Sacks = total purchased from expenses (category 'sacks') − total used in production
    const totalSacksPurchased = expenses
    .filter(e => e.category && e.category.toLowerCase() === 'sacks')
    .reduce((sum, e) => sum + Number(e.unit_value || 0), 0);

    const totalSacksUsed = productions.reduce((sum, p) => sum + Number(p.sacks_used || 0), 0);

  
    return {
      maize: totalMaizeProcured - totalMaizeUsed,
      flour: totalFlourProduced - totalFlourSold,
      bran: totalBranProduced - totalBranSold,
      sacks: totalSacksPurchased - totalSacksUsed,
    };
  }

  export function calculateCurrentStocksFromMovements(movements) {
    const items = ["Maize", "Flour", "Bran", "Sacks"];
    const stocks = {};
  
    items.forEach(item => {
      const relevant = movements.filter(m => m.item === item);
      const total = relevant.reduce((sum, m) => sum + Number(m.quantityIn || 0) - Number(m.quantityOut || 0), 0);
      stocks[item.toLowerCase()] = total;
    });
  
    return stocks;
  }
  
  