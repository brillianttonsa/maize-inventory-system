import { Wheat, Package } from "lucide-react";
import OverviewCard from "./OverviewCard";


export default function OverviewGrid({ currentStock }) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <OverviewCard title="Maize in Stock" value={currentStock.maize} unit="kg" icon={Wheat} colorClass="border-l-4 border-yellow-500" />
      <OverviewCard title="Flour in Stock" value={currentStock.flour} unit="kg" icon={Wheat} colorClass="border-l-4 border-amber-200" />
      <OverviewCard title="Bran in Stock" value={currentStock.bran} unit="kg" icon={Package} colorClass="border-l-4 border-amber-700" />
      <OverviewCard title="Sacks Remaining" value={currentStock.sacks} unit="units" icon={Package} colorClass="border-l-4 border-green-500" />
    
    </div>
  );
}
