import { useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";

export default function Report() {
  const [errors, setErrors] = useState(null);
  const [reportType, setReportType] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [htmlPreview, setHtmlPreview] = useState(null);

  const reduxUser = useSelector((state) => state.auth.user);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErrors(null);
    setHtmlPreview(null);

    try {
      const isHtml = outputFormat === "html";
      const isJson = outputFormat === "json";

      const response = await axiosClient.post(
        "/reports/generate",
        {
          reportType,
          outputFormat,
        },
        {
          responseType: isHtml ? "text" : isJson ? "json" : "blob",
        }
      );

      if (isHtml) {
        setHtmlPreview(response.data);
        return;
      }

      const mimeType = {
        pdf: "application/pdf",
        excel: "application/vnd.ms-excel",
        csv: "text/csv",
        json: "application/json",
      }[outputFormat];

      const fileExtension = {
        pdf: "pdf",
        excel: "xls",
        csv: "csv",
        json: "json",
      }[outputFormat];

      const data = isJson
        ? JSON.stringify(response.data, null, 2)
        : response.data;

      const blob = new Blob([data], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${reportType}-report.${fileExtension}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      const friendlyMessage = handleApiError(err);
      setErrors(friendlyMessage);
    }
  };

  return (
    <>
      <h1>Report</h1>

      <div className="card animated fadeInDown">
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <select
            name="reportType"
            required
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="" disabled>
              Select Report Type
            </option>
            <option value="users">Users Report</option>
            <option value="organisations">Organisations Report</option>
          </select>

          <select
            name="outputFormat"
            required
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="" disabled>
              Select Output Format
            </option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
          </select>

          <button className="btn">Generate Report</button>
        </form>
      </div>

      {outputFormat === "html" && htmlPreview && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <h2>HTML Report Preview</h2>
          <div
            className="html-preview"
            style={{
              overflowX: "auto",
              padding: "1rem",
              border: "1px solid #ccc",
            }}
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
          />
          <button className="btn" onClick={() => window.print()}>
            Print Report
          </button>
        </div>
      )}
    </>
  );
}
