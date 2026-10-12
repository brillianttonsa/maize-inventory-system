import api from './api';
import type { ReportType } from '../types';

function downloadCsv(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function filenameFromResponse(contentDisposition: string | undefined, fallback: string) {
  const match = contentDisposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  return match?.[1].replace(/['"]/g, '') ?? fallback;
}

export const reportsService = {
  async generateReport(type: ReportType): Promise<{ success: boolean; filename: string }> {
    const response = await api.post('/reports/generate', { type }, {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json' },
    });
    const filename = filenameFromResponse(
      response.headers['content-disposition'],
      `${type}_report_${new Date().toISOString().split('T')[0]}.csv`,
    );
    downloadCsv(response.data, filename);
    return { success: true, filename };
  },

  async generateComprehensiveReport(): Promise<{ success: boolean }> {
    const response = await api.get('/reports/comprehensive', { responseType: 'blob' });
    const filename = filenameFromResponse(
      response.headers['content-disposition'],
      `comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`,
    );
    downloadCsv(response.data, filename);
    return { success: true };
  },

  async archiveAndReset(): Promise<{ success: boolean; filename: string }> {
    const response = await api.post('/reports/archive-and-reset', undefined, {
      responseType: 'blob',
    });
    const filename = filenameFromResponse(
      response.headers['content-disposition'],
      `maize_inventory_archive_${new Date().toISOString().split('T')[0]}.csv`,
    );
    downloadCsv(response.data, filename);
    return { success: true, filename };
  },
};
