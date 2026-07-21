import { useState, useRef } from "react";
import "./ResumeUpload.css";

function ResumeUpload() {

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef(null);

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
}
async function handleAnalyze() {
  if (!file) {
    alert("Please select a resume first.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

console.log(data);

setAnalysis(data);
  } catch (error) {
    console.error(error);
    alert("Upload failed.");
  }
}
  return (
  <div className="upload-card">

    <h2>📄 Upload Your Resume</h2>

    <p className="subtitle">
      Upload your resume to receive an AI-powered ATS analysis.
    </p>

   <label className="upload-box">
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
        <h3>📄 {file.name}</h3>

        <p>
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </>
    ) : (
      <>
        <h3>📁 Click to Upload Resume</h3>

        <p>PDF, DOC, DOCX (Max 5 MB)</p>
      </>
    )}

  </div>
</label>
 {analysis && (
  <div className="analysis-card">

    <h2>ATS Analysis Report</h2>

    <h3>ATS Score</h3>
    <h4>Score Breakdown</h4>

<p>Skills Score: {analysis.skillScore}/50</p>

<p>Section Score: {analysis.sectionScore}/50</p>

<div className="score-bar">
    <div
        className="score-fill"
        style={{ width: `${analysis.atsScore}%` }}
    ></div>
</div>

<p>{analysis.atsScore}% Match</p>

    <h4>Matched Skills</h4>

    <div className="skill-list">
    {analysis.matchedSkills.map((skill) => (
        <span className="matched-skill" key={skill}>
            {skill}
        </span>
    ))}
</div>

    <h4>Missing Skills</h4>
    <h4>🤖 AI Suggestions</h4>

<pre className="ai-suggestions">
  {analysis.suggestions}
</pre>

    <div className="skill-list">
    {analysis.missingSkills.map((skill) => (
        <span className="missing-skill" key={skill}>
            {skill}
        </span>
    ))}
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
        <p className="file-name">
          📄 {file.name}
        </p>

        <p className="file-size">
          Size: {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>

        <p className="success-message">
          ✅ Ready to Analyze
        </p>
<div className="job-description">
    <label>Job Description</label>

    <textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
    />
</div>
        <div className="button-group">
          <button onClick={handleRemove}>
            Remove
          </button>

          <button onClick={handleAnalyze}>
            Analyze Resume
          </button>
        </div>
      </>
    )}

  </div>
);
}

export default ResumeUpload;