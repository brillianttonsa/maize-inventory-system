import { Download, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export const ReportTypeCard = ({ icon: Icon, title, description, iconColor, onDownload, loading }) => {
  const handleDownload = () => {
    if (onDownload && !loading) {
      onDownload();
    }
  };

  return (
    <Card className="hover:border-yellow-400 transition-all">
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
        <Button 
          className="w-full gap-2" 
          onClick={handleDownload}
          disabled={loading}
        >
          
              <Download className="h-4 w-4" /> Download Report
            
          
        </Button>
      </Card.Content>
    </Card>
  );
};
