import React, { useState, useEffect } from "react";
import { Lock, User, Mail, CheckCircle, XCircle } from "lucide-react";
import { updateUserPassword } from "../services/settingService";
import { useAuth } from "../context/AuthContext";
import Notification from "../components/dashboardcomponents/settings/Notification";


// --- Custom Notification Component ---

export default function App() {
  const { currentUser } = useAuth();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" }); // { text: "...", type: "success" | "error" }

  const clearMessage = () => setMessage({ text: "", type: "" });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ text: "New passwords do not match!", type: "error" });
      return;
    }
  
    if (passwords.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters long.", type: "error" });
      return;
    }
  
    try {
      const res = await updateUserPassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
  
      // API success message
      setMessage({ text: res.message || "Password updated successfully!", type: "success" });
  
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update password.";
  
      setMessage({ text: errorMsg, type: "error" });
    }
  };
  
  
  // Fixed Light-Mode Tailwind Classes
  const bgColor = "bg-zinc-50"; 
  const textColor = "text-gray-900";
  const cardBg = "bg-white border-zinc-200";
  const inputBg = "bg-white text-gray-800 border-gray-300";
  const focusRing = "focus:ring-yellow-500 focus:border-yellow-500";
  
  // Primary button style (Yellow)
  const PRIMARY_BUTTON_CLASSES = "bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-600 transition duration-200 shadow-md";


  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 font-sans ${bgColor} ${textColor}`}>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-yellow-500 border-b pb-2 border-yellow-600/30">
          User Settings
        </h1>
        
        {/* Profile and Security Card */}
        <div className={`rounded-2xl p-6 shadow-xl border ${cardBg}`}>
          <h2 className="flex items-center text-2xl font-bold mb-6 text-yellow-500">
            <User className="w-6 h-6 mr-3" />
            Profile & Security
          </h2>

          <div className="space-y-6">
            
            {/* Disabled Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <div className={`flex items-center bg-zinc-100 rounded-xl p-3 shadow-inner cursor-not-allowed border border-gray-200`}>
                    <User className="w-5 h-5 mr-3 opacity-60 text-yellow-500" />
                    <input
                      type="text"
                      value={currentUser?.name}
                      disabled
                      className={`w-full bg-transparent outline-none cursor-not-allowed text-gray-600`}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <div className={`flex items-center bg-zinc-100 rounded-xl p-3 shadow-inner cursor-not-allowed border border-gray-200`}>
                    <Mail className="w-5 h-5 mr-3 opacity-60 text-yellow-500" />
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className={`w-full bg-transparent outline-none cursor-not-allowed text-gray-600`}
                    />
                </div>
              </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="flex items-center text-xl font-semibold mb-3 text-yellow-600">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </h3>

              <input
                type="password"
                name="oldPassword"
                placeholder="Current Password"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                required
                className={`w-full p-3 rounded-xl transition border ${inputBg} ${focusRing} shadow-sm placeholder:text-zinc-400`}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password (min 6 chars)"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required
                className={`w-full p-3 rounded-xl transition border ${inputBg} ${focusRing} shadow-sm placeholder:text-zinc-400`}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                required
                className={`w-full p-3 rounded-xl transition border ${inputBg} ${focusRing} shadow-sm placeholder:text-zinc-400`}
              />

              <button
                type="submit"
                className={`w-full rounded-xl py-3 mt-4 text-base ${PRIMARY_BUTTON_CLASSES} focus:outline-none focus:ring-4 focus:ring-yellow-500/50`}
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <Notification message={message} clearMessage={clearMessage} />
    </div>
  );
}