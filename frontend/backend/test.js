const calculateATSScore = require("./atsScorer");

const resumeSkills = [
  "Python",
  "React",
  "Git",
  "AWS"
];

const jobSkills = [
  "Python",
  "React",
  "Node.js",
  "Express",
  "Git"
];

console.log(calculateATSScore(resumeSkills, jobSkills));