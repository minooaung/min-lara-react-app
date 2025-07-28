import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { AxiosResponse } from "axios";

type OutputFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';
type ReportType = 'users' | 'organisations';

interface ReportMetadata {
  mimeType: string;
  fileExtension: string;
}

interface GenerateReportParams {
  reportType: ReportType;
  outputFormat: OutputFormat;
}

// Helper function to get MIME type and file extension
const getReportMetadata = (outputFormat: OutputFormat): ReportMetadata => {
  const mimeTypes: Record<OutputFormat, string> = {
    pdf: "application/pdf",
    excel: "application/vnd.ms-excel",
    csv: "text/csv",
    json: "application/json",
    html: "text/html",
  };

  const fileExtensions: Record<OutputFormat, string> = {
    pdf: "pdf",
    excel: "xls",
    csv: "csv",
    json: "json",
    html: "html",
  };

  return {
    mimeType: mimeTypes[outputFormat],
    fileExtension: fileExtensions[outputFormat],
  };
};

// Helper function to handle report response
const handleReportResponse = (
  response: AxiosResponse<any>,
  reportType: ReportType,
  outputFormat: OutputFormat
): string | null => {
  if (outputFormat === "html") {
    return response.data;
  }

  // For all file downloads (PDF, Excel, CSV, JSON)
  const { mimeType, fileExtension } = getReportMetadata(outputFormat);
  const data = outputFormat === "json" ? JSON.stringify(response.data, null, 2) : response.data;
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${reportType}-report.${fileExtension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return null; // No data to return for file downloads
};

export const useGenerateReport = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({ reportType, outputFormat }: GenerateReportParams) => {
      const isHtml = outputFormat === "html";
      const isJson = outputFormat === "json";

      const response = await axios.post(
        "/reports/generate",
        {
          reportType,
          outputFormat,
        },
        {
          responseType: isHtml ? "text" : isJson ? "json" : "blob",
        }
      );

      return handleReportResponse(response, reportType, outputFormat);
    },
  });
};

// Optional: Add more report-related hooks here if needed
// For example, hooks for saving report preferences, fetching available report types, etc. 