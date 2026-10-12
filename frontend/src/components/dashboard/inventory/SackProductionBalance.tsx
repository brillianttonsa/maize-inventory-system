import { PackageCheck } from 'lucide-react';
import type { SackProductionBalance } from './inventoryUtils';

interface SackProductionBalanceProps {
  balances: SackProductionBalance[];
}

export default function SackProductionBalance({ balances }: SackProductionBalanceProps) {
  const totals = balances.reduce(
    (sum, balance) => ({
      produced: sum.produced + balance.produced,
      sold: sum.sold + balance.sold,
      remaining: sum.remaining + balance.remaining,
    }),
    { produced: 0, sold: 0, remaining: 0 },
  );

  return (
    <section className="rounded-xl border border-green-200 bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-2">
        <PackageCheck className="h-6 w-6 text-green-600" />
        <div>
          <h2 className="text-xl font-bold text-green-700">Produced vs Sold Sacks</h2>
          <p className="text-sm text-gray-500">Packaged flour sacks produced, sold, and still available.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              {['Sack Size', 'Produced', 'Sold', 'Remaining'].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {balances.map((balance) => (
              <tr key={balance.size} className="hover:bg-green-50/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{balance.size} kg sacks</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-700">{balance.produced}</td>
                <td className="px-4 py-3 text-sm font-semibold text-red-600">{balance.sold}</td>
                <td className={`px-4 py-3 text-sm font-bold ${balance.remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
                  {balance.remaining}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr className="font-bold text-gray-800">
              <td className="px-4 py-3 text-sm">Total</td>
              <td className="px-4 py-3 text-sm text-blue-700">{totals.produced}</td>
              <td className="px-4 py-3 text-sm text-red-600">{totals.sold}</td>
              <td className={`px-4 py-3 text-sm ${totals.remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
                {totals.remaining}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
