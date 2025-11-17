import { useState } from "react";
import { Card } from "../components/dashboardcomponents/reports/Card";
import { ReportTypeCard } from "../components/dashboardcomponents/reports/ReportTypeCard";
import { Button } from "../components/dashboardcomponents/reports/Button";
import {  FileText, Loader2 } from "lucide-react";
import { reportsService } from "../services/reportsService";
import { reportTypes } from "../components/dashboardcomponents/reports/reportTypes";

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [loadingComprehensive, setLoadingComprehensive] = useState(false);


  const handleGenerateReport = async (type) => {
    try {
      setLoading(true);
      await reportsService.generateReport(type);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateComprehensiveReport = async () => {
    try {
      setLoadingComprehensive(true);
      await reportsService.generateComprehensiveReport();
    } catch (error) {
      console.error("Error generating comprehensive report:", error);
      alert("Failed to generate comprehensive report. Please try again.");
    } finally {
      setLoadingComprehensive(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-yellow-600">Reports</h1>
        <p className="text-gray-500">
          Generate and download comprehensive reports for all operations
        </p>
      </div>

      {/* Comprehensive PDF Report */}
      <Card className="shadow-lg border border-l-4 border-yellow-500">
        <Card.Header>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-yellow-600" />
            <h3 className="text-2xl font-semibold text-yellow-600">Comprehensive PDF Report</h3>
          </div>
          <Card.Description className="mt-2">
            Generate a complete PDF report combining all reports, visualizations, charts, and comments in one document
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button 
            className="w-full gap-2" 
            onClick={handleGenerateComprehensiveReport}
            disabled={loadingComprehensive}
          >
            {loadingComprehensive ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" /> Generate Comprehensive PDF Report
              </>
            )}
          </Button>
        </Card.Content>
      </Card>

      {/* Report Type Cards */}
      <div>
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Individual Reports (CSV)</h2>
          <span>{loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>): <>
              {""}
            </>}</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1 2xl:row-span-2">
          {reportTypes.map((r) => (
            <ReportTypeCard 
              key={r.id} 
              {...r} 
              onDownload={() => handleGenerateReport(r.type)}
              loading={loading}
            />
          ))}
        </div>
      </div>

    </div>
  );
}