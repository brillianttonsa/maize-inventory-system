import useRecentActivities from "../../../hooks/useRecentActivities";
import { useNavigate } from "react-router-dom";

const RecentActivity = () => {
  const activities = useRecentActivities();
  const navigate = useNavigate();

  const getTypeColor = (type) => {
    switch (type) {
      case "procurement": return "bg-amber-100 text-amber-800";
      case "production": return "bg-green-100 text-green-800";
      case "sales": return "bg-purple-100 text-purple-800";
      case "expense": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!activities.length) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl p-4 mt-4 border border-yellow-300">
      <ul className="divide-y divide-gray-200">
        {activities.map((activity) => {
          const Icon = activity.IconComponent;
          return (
            <li key={activity.id} className="py-3">
              <div className="flex items-start">
                <div className={`p-2 rounded-full flex-shrink-0 ${getTypeColor(activity.type)}`}>
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">{activity.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">{activity.user}</span>
                    <span className="mx-2 text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-center">
      <button
          onClick={() => navigate("/inventory")} // navigate to inventory page
          className="text-amber-600 hover:text-amber-700 text-sm font-medium hover:underline transition-colors"
        >
          View All Activity
        </button> 
      </div>
    </div>
  );
};

export default RecentActivity;
