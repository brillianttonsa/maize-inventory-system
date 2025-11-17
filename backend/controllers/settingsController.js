import * as settingsService from "../services/settingsService.js";

export const updateProfile = async (req, res) => {
  try {
    const data = await settingsService.updateProfile(req.user.id, req.body);
    res.json({ message: "Profile updated", user: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    await settingsService.changePassword(req.user.id, req.body);
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
