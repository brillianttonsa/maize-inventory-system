import { Download } from 'lucide-react';

interface ExportCSVButtonProps<T> {
  data: T[];
  filename: string;
  headers: string[];
  dataMapper: (item: T, index: number) => (string | number | null | undefined)[];
  disabled?: boolean;
}

function ExportCSVButton<T>({
  data,
  filename,
  headers,
  dataMapper,
  disabled = false,
}: ExportCSVButtonProps<T>) {
  const handleExportCsv = () => {
    if (!data || data.length === 0) {
      alert('No data to export!');
      return;
    }

    const csvRows = data.map((item, index) => {
      const row = dataMapper(item, index);

      return row
        .map((value) => {
          let strValue = String(value ?? '');
          strValue = strValue.replace(/"/g, '""');

          if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
            return `"${strValue}"`;
          }
          return strValue;
        })
        .join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportCsv}
      className="flex items-center gap-2 py-1.5 px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors text-sm shadow-md"
      disabled={disabled}
    >
      <Download className="h-4 w-4" />
      <span>Export All</span>
    </button>
  );
}

export default ExportCSVButton;
