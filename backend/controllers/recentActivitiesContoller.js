import { getInventoryMovements } from "./inventorymovementsController.js";

export const getRecentInventoryActivities = async (req, res) => {
    try {
      
    
      const movementsResponse = await new Promise((resolve, reject) => {
        getInventoryMovements(
          { user: req.user },
          {
            json: resolve,
            status: () => ({ json: reject }),
          }
        );
      });
  
      // Sort descending (most recent first)
      const recent = movementsResponse
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6) // last 6 activities
        .map((m) => ({
          date: m.date,
          remarks: m.remarks,
          source: m.source,
        }));
  
      res.json(recent);
    } catch (error) {
      console.error("Error fetching recent inventory activities:", error);
      res.status(500).json({ message: "Failed to fetch recent inventory activities" });
    }
  };
  