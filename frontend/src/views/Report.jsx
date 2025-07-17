import { useState } from "react";
import { useGenerateReport } from "../hooks/queries/useReports";

export default function Report() {
  const [reportType, setReportType] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [htmlPreview, setHtmlPreview] = useState(null);

  const generateReportMutation = useGenerateReport();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setHtmlPreview(null);

    try {
      const result = await generateReportMutation.mutateAsync({
        reportType,
        outputFormat,
      });

      // For HTML format, update preview
      if (outputFormat === "html") {
        setHtmlPreview(result);
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
    }
  };

  return (
    <div>
      <h1>Generate Report</h1>
      <div className="card animated fadeInDown">
        {generateReportMutation.error && (
          <div className="alert">
            {Object.keys(generateReportMutation.error).map((key) => (
              <p key={key}>{generateReportMutation.error[key][0]}</p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>Report Type:</label>
            <select
              value={reportType}
              onChange={(ev) => setReportType(ev.target.value)}
              required
            >
              <option value="">Select Report Type</option>
              <option value="users">Users Report</option>
              <option value="organisations">Organisations Report</option>
            </select>
          </div>

          <div className="input-group">
            <label>Output Format:</label>
            <select
              value={outputFormat}
              onChange={(ev) => setOutputFormat(ev.target.value)}
              required
            >
              <option value="">Select Format</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="html">HTML Preview</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn"
            disabled={generateReportMutation.isPending}
          >
            {generateReportMutation.isPending ? "Generating..." : "Generate Report"}
          </button>
        </form>

        {/* HTML Preview Section */}
        {htmlPreview && (
          <div className="preview-section">
            <h2>Report Preview</h2>
            <div 
              className="html-preview"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
            <button className="btn" onClick={() => window.print()}>
              Print Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
