const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInsight = async (summaryText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a smart financial assistant.

Analyze this user's expense summary and give:
- 2–3 short insights
- 1 saving suggestion

Keep response under 80 words.

Expense Summary:
${summaryText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text().trim();
};

module.exports = { generateInsight };
