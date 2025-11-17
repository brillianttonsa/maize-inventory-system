import api from "./api";

export const reportsService = {
  // Generate and download a report
  generateReport: async (type) => {
    try {
      const response = await api.post(
        "/reports/generate",
        { type },
        { 
          responseType: "blob", // Important for CSV download
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      // response.data is already a Blob when responseType is "blob"
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Extract filename from Content-Disposition header or create one
      const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
      let filename = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      // If error response is a blob (like error message), try to read it
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Failed to generate report");
        } catch {
          throw new Error("Failed to generate report");
        }
      }
      throw error;
    }
  },

  

  // Generate comprehensive PDF report
  generateComprehensiveReport: async () => {
    try {
      const response = await api.get("/reports/comprehensive", {
        responseType: "blob"
      });
      
      // Create blob and open in new window for printing/downloading
      const blob = new Blob([response.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");
      
      // If popup blocked, create download link
      if (!newWindow) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `comprehensive_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      
      // Clean up URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      return { success: true };
    } catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Failed to generate comprehensive report");
        } catch {
          throw new Error("Failed to generate comprehensive report");
        }
      }
      throw error;
    }
  },
};

