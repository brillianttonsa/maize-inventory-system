import { Wheat, Package, Zap } from 'lucide-react';
import OverviewCard from './OverviewCard';
import type { CurrentStocks } from './inventoryUtils';

interface OverviewGridProps {
  currentStock: CurrentStocks;
}

export default function OverviewGrid({ currentStock }: OverviewGridProps) {
  return (
    <div className="grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
      <OverviewCard
        title="Maize in Stock"
        value={currentStock.maize}
        unit="kg"
        icon={Wheat}
        colorClass="border-l-4 border-yellow-500"
      />
      <OverviewCard
        title="Flour in Stock"
        value={currentStock.flour}
        unit="kg"
        icon={Wheat}
        colorClass="border-l-4 border-amber-200"
      />
      <OverviewCard
        title="Bran in Stock"
        value={currentStock.bran}
        unit="sacks"
        icon={Package}
        colorClass="border-l-4 border-amber-700"
      />
      <OverviewCard
        title="5 kg Sacks"
        value={currentStock.sacks5kg}
        unit="sacks"
        icon={Package}
        colorClass="border-l-4 border-green-500"
      />
      <OverviewCard title="10 kg Sacks" value={currentStock.sacks10kg} unit="sacks" icon={Package} colorClass="border-l-4 border-emerald-500" />
      <OverviewCard title="25 kg Sacks" value={currentStock.sacks25kg} unit="sacks" icon={Package} colorClass="border-l-4 border-teal-500" />
      <OverviewCard
        title="Electricity in Stock"
        value={currentStock.electricityUnits}
        unit="units"
        icon={Zap}
        colorClass="border-l-4 border-yellow-500"
      />
    </div>
  );
}
