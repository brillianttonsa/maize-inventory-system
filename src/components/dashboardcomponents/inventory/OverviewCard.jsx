
const OverviewCard = ({ title, value, unit, icon: Icon, colorClass }) => (
  <div className={`p-4 rounded-xl border-l-4 shadow-lg bg-white ${colorClass}`}>
    <div className='flex items-center justify-between'>
      <Icon className={'h-6 w-6 text-yellow-700'} />
    </div>
    <p className="text-sm text-gray-500 mt-2">{title}</p>
    <h2 className={`text-2xl font-bold mt-1 text-yellow-700`}>
      {value.toLocaleString()} {unit}
    </h2>
  </div>
);

export default OverviewCard;
