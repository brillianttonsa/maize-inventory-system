import { Pencil, Trash2 } from 'lucide-react';
import { useOperationalCostsLogic } from '../hooks/useOperationalCostsLogic';

const money = (value: number) => `${value.toLocaleString()}/=`;

export default function OperationalCosts() {
  const {
    formData,
    records,
    summary,
    editId,
    error,
    loading,
    saving,
    handleChange,
    handleSave,
    handleEdit,
    handleCancelEdit,
    handleDelete,
  } = useOperationalCostsLogic();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-yellow-700">Operational Costs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Record electricity use by the balance before work and the units remaining after it.
          Electricity purchases are recorded under Expenses. Units do not carry over to another round.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Units purchased', `${summary.purchasedUnits.toLocaleString()} units`],
          ['Units used', `${summary.usedUnits.toLocaleString()} units`],
          ['Units remaining', `${summary.remainingUnits.toLocaleString()} units`],
          ['Recorded operational cost', money(summary.totalOperationalCost)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border-l-4 border-green-600 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-600">{label}</p>
            <p className="mt-1 font-bold text-green-800">{loading ? 'Loading…' : value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-yellow-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-yellow-700">
          {editId ? 'Edit electricity operation' : 'Record electricity operation'}
        </h2>
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Operation date
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Work / operation
            <input
              name="operation"
              value={formData.operation}
              onChange={handleChange}
              maxLength={255}
              required
              placeholder="e.g. Milling shift"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Units at start
            <input
              type="number"
              name="startingUnits"
              value={formData.startingUnits}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Units remaining after work
            <input
              type="number"
              name="remainingUnits"
              value={formData.remainingUnits}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Actual operational cost (/=)
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Notes (optional)
            <input
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </label>
          {error && <p className="md:col-span-2 text-sm text-red-600" role="alert">{error}</p>}
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving} className="rounded-md bg-yellow-500 px-4 py-2 font-semibold text-black disabled:opacity-50">
              {saving ? 'Saving…' : editId ? 'Update operation' : 'Save operation'}
            </button>
            {editId && (
              <button type="button" onClick={handleCancelEdit} disabled={saving} className="rounded-md border px-4 py-2">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-yellow-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-yellow-700">Electricity operation records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-yellow-100">
              <tr>
                {['Date', 'Operation', 'Units at start', 'Units used', 'Units remaining', 'Actual cost', 'Notes', 'Actions'].map((heading) => (
                  <th key={heading} className="px-3 py-3 text-left font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-3 py-5 text-center text-gray-500">Loading records…</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-5 text-center text-gray-500">No electricity operations recorded for this round.</td></tr>
              ) : records.map((record) => (
                <tr key={record.id}>
                  <td className="px-3 py-3 whitespace-nowrap">{record.date}</td>
                  <td className="px-3 py-3">{record.operation}</td>
                  <td className="px-3 py-3 text-right">{Number(record.starting_units).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">{Number(record.units_used).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">{Number(record.remaining_units).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">{money(Number(record.total_amount))}</td>
                  <td className="px-3 py-3">{record.notes || '—'}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <button type="button" onClick={() => handleEdit(record)} aria-label={`Edit ${record.operation}`} className="mr-3 text-blue-600 hover:text-blue-800">
                      <Pencil className="inline h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(record)} aria-label={`Delete ${record.operation}`} className="text-red-600 hover:text-red-800">
                      <Trash2 className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
