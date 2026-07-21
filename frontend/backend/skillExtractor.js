const skills = [
  "Java",
  "Python",
  "SQL",
  "JavaScript",
  "React",
  "React Native",
  "Node.js",
  "Express",
  "Django",
  "HTML",
  "CSS",
  "REST API",
  "REST APIs",
  "MongoDB",
  "AWS",
  "Git",
  "TensorFlow",
  "Keras",
  "Scikit-learn",
  "OpenCV",
  "Docker",
  "Kubernetes",
];

function extractSkills(text) {
  return skills.filter((skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
    return regex.test(text);
  });
}

module.exports = extractSkills;