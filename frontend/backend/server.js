require("dotenv").config();
const extractSections = require("./sectionExtractor");
const getAISuggestions = require("./aiSuggestion");
const calculateATSScore = require("./atsScorer");
const extractSkills = require("./skillExtractor");
const extractText = require("./parser");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage });

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 AI Resume Analyzer Backend is Running!");
});

// Upload Route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const text = await extractText(req.file.path);

    const detectedSkills = extractSkills(text);

    const jobDescription = req.body.jobDescription;

    console.log("===== REQUEST BODY =====");
    console.log(req.body);

    console.log("===== JOB DESCRIPTION =====");
    console.log(jobDescription);

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        message: "Please provide a job description.",
      });
    }

    const jobSkills = extractSkills(jobDescription);
    const sections = extractSections(text);

    console.log("===== JOB SKILLS =====");
    console.log(jobSkills);

    const result = calculateATSScore(
    detectedSkills,
    jobSkills,
    sections
);
const suggestions = await getAISuggestions(
    text,
    jobDescription,
    result.missingSkills
);


    console.log("===== DETECTED SKILLS =====");
    console.log(detectedSkills);

    res.json({
      message: "Resume analyzed successfully!",
      detectedSkills,
      atsScore: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      sections,
      skillScore: result.skillScore,
      sectionScore: result.sectionScore,
      suggestions
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error parsing resume.",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});