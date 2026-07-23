import { useState, useRef } from "react";
import jsPDF from "jspdf";
import "./ResumeUpload.css";

function ResumeUpload() {

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
function handleDrag(e) {
  e.preventDefault();
  e.stopPropagation();

  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  } else if (e.type === "dragleave") {
    setDragActive(false);
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  setDragActive(false);

  const droppedFile = e.dataTransfer.files[0];

  if (!droppedFile) return;

  const fakeEvent = {
    target: {
      files: [droppedFile],
    },
  };

  handleFileChange(fakeEvent);
}
 const scoreColor = analysis
  ? analysis.atsScore >= 80
    ? "#22c55e"
    : analysis.atsScore >= 60
      ? "#f59e0b"
      : "#ef4444"
  : "#ef4444";

  function handleFileChange(event) {
  const selectedFile = event.target.files[0];

  if (!selectedFile) return;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(selectedFile.type)) {
    setFile(null);
    setError("Only PDF, DOC, and DOCX files are allowed.");
    return;
  }
  if (selectedFile.size > 5 * 1024 * 1024) {
    setFile(null);
    setError("File size must be 5 MB or less.");
    return;
  }

  setFile(selectedFile);
  setError("");
}

function handleRemove() {
  setFile(null);
  setError("");
  setAnalysis(null);
  setJobDescription("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}
function downloadReport() {
    if (!analysis) return;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AI Resume Analyzer Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`ATS Score: ${analysis.atsScore}%`, 20, 40);
    doc.text(`Skills Score: ${analysis.skillScore}/50`, 20, 50);
    doc.text(`Section Score: ${analysis.sectionScore}/50`, 20, 60);

    doc.text("Matched Skills:", 20, 80);
    doc.text(analysis.matchedSkills.join(", "), 20, 90);

    doc.text("Missing Skills:", 20, 110);
    doc.text(analysis.missingSkills.join(", "), 20, 120);

    doc.text("AI Suggestions:", 20, 140);

    const suggestions = doc.splitTextToSize(
        analysis.suggestions || "No suggestions available.",
        170
    );

    doc.text(suggestions, 20, 150);

    doc.save("ATS_Report.pdf");
}
async function handleAnalyze() {
  
  if (!file) {
    alert("Please select a resume first.");
    return;
  }
  setLoading(true);
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || "Something went wrong.");
}

console.log(data);

setAnalysis(data);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
}
  return (
  <div className="upload-card">

    <h2>📄 Upload Your Resume</h2>

    <p className="subtitle">
      Upload your resume to receive an AI-powered ATS analysis.
    </p>

   <label
  className={`upload-box ${dragActive ? "drag-active" : ""}`}
  onDragEnter={handleDrag}
  onDragOver={handleDrag}
  onDragLeave={handleDrag}
  onDrop={handleDrop}
>
  <input
  ref={fileInputRef}
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={handleFileChange}
  hidden
/>

  <div className="upload-content">

    {file ? (
      <>
    <div className="upload-success-icon">✅</div>

    <h3>{file.name}</h3>

    <p>
        {(file.size / 1024 / 1024).toFixed(2)} MB
    </p>

    <small>Ready for analysis</small>
</>
    ) : (
      <>
        <h3>📁 Drag & Drop Resume Here</h3>

<p>or Click to Browse</p>

<p>PDF, DOC, DOCX (Max 5 MB)</p>
      </>
    )}

  </div>
</label>
{!analysis && (
    <div className="empty-state">

        <div className="empty-icon">🤖</div>

        <h3>No Analysis Yet</h3>

        <p>
            Upload your resume, paste the job description, and click
<strong> Analyze Resume </strong>
to generate your ATS report.
        </p>

    </div>
)}
 {analysis && (
  <div className="analysis-card">

    <div className="analysis-header">
    <h2>📊 ATS Analysis Report</h2>

    <p>Resume evaluated successfully</p>
</div>

    <h3 className="section-title">
    📊 Score Breakdown
</h3>

<div className="score-grid">

    <div className="mini-card">
    <div className="card-icon">💻</div>

    <h3>Skills Score</h3>

    <h2>{analysis.skillScore}/50</h2>
</div>

<div className="mini-card">
    <div className="card-icon">📑</div>

    <h3>Section Score</h3>

    <h2>{analysis.sectionScore}/50</h2>
</div>

</div>

<div className="circle-score">

    <svg className="progress-ring" width="180" height="180">

        <circle
            className="progress-ring-bg"
            cx="90"
            cy="90"
            r="70"
        />

        <circle
    className="progress-ring-fill"
    cx="90"
    cy="90"
    r="70"
    style={{
        stroke: scoreColor,
        strokeDashoffset:
            440 - (440 * analysis.atsScore) / 100,
    }}
/>

    </svg>

    <div className="score-text">
    <h1 style={{ color: scoreColor }}>
        {analysis.atsScore}%
    </h1>

    <p>ATS Score</p>
</div>

</div>
    <h3 className="section-title">
    ✅ Matched Skills
</h3>

    <div className="skill-list">
    {analysis.matchedSkills.map((skill) => (
        <span className="matched-skill" key={skill}>
            {skill}
        </span>
    ))}
</div>

    <h3 className="section-title">
    ❌ Missing Skills
</h3>
    <div className="suggestion-card">

    <h3>🤖 AI Suggestions</h3>

    <pre className="ai-suggestions">
    {analysis.suggestions ||
     "AI suggestions will appear here after analysis."}
</pre>

</div>
    <div className="skill-list">
    {analysis.missingSkills.map((skill) => (
        <span className="missing-skill" key={skill}>
            {skill}
        </span>
    ))}
</div>
<div className="download-container">
  <button
    className="download-btn"
    onClick={downloadReport}
  >
    📄 Download ATS Report
  </button>
</div>

  </div>
)}

    <p className="file-info">
      PDF • DOC • DOCX • Max 5 MB
    </p>

    {error && (
      <p className="error-message">
        {error}
      </p>
    )}

    {file && (
      <>
        
<div className="job-description">
    <label>Job Description</label>

    <textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
    />
</div>
        <div className="button-group">
          <button
className="remove-btn"
onClick={handleRemove}
>
Remove
</button>

<button
className="analyze-btn"
onClick={handleAnalyze}
disabled={loading}
>
    {loading ? "Analyzing..." : "Analyze Resume"}
</button>
        </div>
      </>
    )}

  </div>
);
}

export default ResumeUpload;