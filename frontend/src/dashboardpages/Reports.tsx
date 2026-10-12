import { useState } from 'react';
import { Card } from '../components/dashboard/reports/Card';
import { ReportTypeCard } from '../components/dashboard/reports/ReportTypeCard';
import { Button } from '../components/dashboard/reports/Button';
import { ArchiveRestore, FileText, Loader2 } from 'lucide-react';
import { reportsService } from '../services/reportsService';
import { reportTypes } from '../components/dashboard/reports/reportTypes';
import type { ReportType } from '../types';

export default function Reports() {
  const [loadingType, setLoadingType] = useState<ReportType | null>(null);
  const [loadingComprehensive, setLoadingComprehensive] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleGenerateReport = async (type: ReportType) => {
    try {
      setLoadingType(type);
      await reportsService.generateReport(type);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoadingType(null);
    }
  };

  const handleArchiveAndReset = async () => {
    const confirmed = window.confirm(
      'This will download a complete CSV archive and permanently remove all your sales, expenses, production, and procurement records. Your account will remain. Continue?',
    );
    if (!confirmed) return;

    try {
      setResetting(true);
      await reportsService.archiveAndReset();
      alert('Your archive has been downloaded. The system is now ready for fresh records.');
      window.location.reload();
    } catch (error) {
      console.error('Error archiving and resetting data:', error);
      alert('Could not archive and reset your data. Nothing should be considered cleared until the download succeeds.');
    } finally {
      setResetting(false);
    }
  };

  const handleGenerateComprehensiveReport = async () => {
    try {
      setLoadingComprehensive(true);
      await reportsService.generateComprehensiveReport();
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      alert('Failed to generate comprehensive report. Please try again.');
    } finally {
      setLoadingComprehensive(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-yellow-600">Reports</h1>
        <p className="text-gray-500">Generate and download comprehensive reports for all operations</p>
      </div>

      <Card className="shadow-lg border border-l-4 border-yellow-500">
        <Card.Header>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-yellow-600" />
            <h3 className="text-2xl font-semibold text-yellow-600">Comprehensive Report</h3>
          </div>
          <Card.Description className="mt-2">
            Downloads one CSV with every production, sales, procurement, and expense transaction, plus summary reviews.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button className="w-full gap-2" onClick={handleGenerateComprehensiveReport} disabled={loadingComprehensive}>
            {loadingComprehensive ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Generating report...</>
            ) : (
              <><FileText className="h-5 w-5" /> Download Comprehensive CSV</>
            )}
          </Button>
        </Card.Content>
      </Card>

      <Card className="border border-red-200 shadow-lg">
        <Card.Header>
          <div className="flex items-center gap-2">
            <ArchiveRestore className="h-6 w-6 text-red-600" />
            <h3 className="text-2xl font-semibold text-red-700">Archive &amp; Start Fresh</h3>
          </div>
          <Card.Description className="mt-2">
            Downloads all current operational data as one CSV archive, then permanently removes sales, expenses, production, and procurement records so you can begin again.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleArchiveAndReset}
            disabled={resetting}
          >
            {resetting ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Archiving and resetting...</>
            ) : (
              <><ArchiveRestore className="h-5 w-5" /> Download Archive &amp; Start Fresh</>
            )}
          </Button>
        </Card.Content>
      </Card>

      <div>
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Individual Reports (CSV)</h2>
          <span>{loadingType && <><Loader2 className="h-4 w-4 animate-spin inline" /> Generating...</>}</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1 2xl:row-span-2">
          {reportTypes.map((r) => (
            <ReportTypeCard key={r.id} icon={r.icon} title={r.title} description={r.description}
              iconColor={r.iconColor} onDownload={() => handleGenerateReport(r.type)} loading={loadingType === r.type} />
          ))}
        </div>
      </div>
    </div>
  );
}
