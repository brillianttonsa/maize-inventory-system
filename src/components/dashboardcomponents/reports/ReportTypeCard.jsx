import { FileText, Download } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export const ReportTypeCard = ({ icon: Icon, title, description, iconColor }) => {
  return (
    <Card className="hover:border-yellow-400">
      <Card.Header>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-md ${iconColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <Card.Title className="text-xl text-yellow-600">{title}</Card.Title>
            <Card.Description className="mt-2 text-gray-600">{description}</Card.Description>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <FileText className="h-4 w-4" /> View Sample
          </Button>
          <Button className="flex-1 gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
