import api from "./api";

// Update user profile
export const updateUserProfile = async (data) => {
  const res = await api.put("/settings/profile", data);
  return res.data;
};

// Change password
export const updateUserPassword = async (data) => {
  const res = await api.put("/settings/password", data);
  return res.data;
};
