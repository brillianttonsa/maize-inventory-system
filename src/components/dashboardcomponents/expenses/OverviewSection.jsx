import OverviewCard from "./OverviewCard";


export default function OverviewSection({ overviewData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
      {overviewData.map(card => (
        <OverviewCard 
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
}
