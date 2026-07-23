require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function getAISuggestions(resumeText, jobDescription, missingSkills) {
  try {
    const prompt = `
You are an ATS resume expert.

Resume:
${resumeText}

Job Description:
${jobDescription}

Missing Skills:
${missingSkills.join(", ")}

Give exactly 5 concise resume improvement suggestions as bullet points.
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Groq Error:", error);
    return "Unable to generate AI suggestions at the moment.";
  }
}

module.exports = getAISuggestions;