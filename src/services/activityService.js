import api from "./api"; // your axios instance

// Fetch the 6 most recent inventory activities
export const getRecentActivities = async () => {
  try {
    const res = await api.get("/recent-activities");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch recent activities:", err);
    throw err;
  }
};
