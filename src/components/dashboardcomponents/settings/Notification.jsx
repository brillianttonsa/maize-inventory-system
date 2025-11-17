import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Notification = ({ message, clearMessage }) => {
  if (!message.text) return null;

  const isSuccess = message.type === "success";
  const bgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const Icon = isSuccess ? CheckCircle : XCircle;

  useEffect(() => {
    const timer = setTimeout(clearMessage, 5000);
    return () => clearTimeout(timer);
  }, [message, clearMessage]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center space-x-3 ${bgColor} ${textColor}`}
      role="alert"
    >
      <Icon className="w-6 h-6" />
      <p className="font-medium text-sm">{message.text}</p>

      <button
        onClick={clearMessage}
        className="p-1 rounded-full opacity-70 hover:opacity-100"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
