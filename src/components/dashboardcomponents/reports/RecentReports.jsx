import { FileText, Download } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export const RecentReports = ({ reports }) => {
  return (
    <Card className="shadow-lg border-l-4 border-yellow-500">
      <Card.Header>
        <Card.Title className="text-yellow-600">Recent Reports</Card.Title>
        <Card.Description>Previously generated reports</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{report.name}</p>
                  <p className="text-xs text-gray-500">
                    Generated on {report.date} • {report.size}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-yellow-700">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};
