function extractSections(text) {
  const lowerText = text.toLowerCase();

  return {
    summary:
      lowerText.includes("summary") ||
      lowerText.includes("objective"),

    education:
      lowerText.includes("education"),

    skills:
      lowerText.includes("skills"),

    projects:
      lowerText.includes("projects") ||
      lowerText.includes("project"),

    experience:
      lowerText.includes("experience") ||
      lowerText.includes("work experience"),

    certifications:
      lowerText.includes("certifications") ||
      lowerText.includes("certification"),
  };
}

module.exports = extractSections;