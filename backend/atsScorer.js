function calculateATSScore(resumeSkills, jobSkills, sections) {

    // Skill Score (50 Marks)
    const matchedSkills = resumeSkills.filter(skill =>
        jobSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(skill =>
        !resumeSkills.includes(skill)
    );

    const skillScore = (matchedSkills.length / jobSkills.length) * 50;

    // Section Score (50 Marks)
    let sectionScore = 0;

    if (sections.projects) sectionScore += 20;
    if (sections.experience) sectionScore += 15;
    if (sections.education) sectionScore += 10;
    if (sections.certifications) sectionScore += 5;

    const totalScore = Math.round(skillScore + sectionScore);

    return {
        score: totalScore,
        matchedSkills,
        missingSkills,
        skillScore: Math.round(skillScore),
        sectionScore
    };
}

module.exports = calculateATSScore;