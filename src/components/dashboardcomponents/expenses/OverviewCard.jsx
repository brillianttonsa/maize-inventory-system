
const OverviewCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-4 rounded-xl border-l-4 shadow-md bg-white border-${color}-500 transition-all duration-300 hover:shadow-xl`}>
    <div className='flex items-center justify-between'>
      <Icon className="h-6 w-6'text-yellow-700" />
    </div>
    <p className="text-xs sm:text-sm text-gray-500 mt-2 truncate">{title}</p>
    <h2 className={`text-xl font-bold mt-1 text-gray-900`}>
      Tsh {value}
    </h2>
  </div>
);

export default OverviewCard;