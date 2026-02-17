const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ===== CATEGORY PREDICTION ===== */
const predictCategory = async (description) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Classify the expense into ONLY ONE of these categories:
Food, Travel, Shopping, Salary, Petrol, Other.

Expense description: "${description}"

Return ONLY the category name.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  return text;
};

module.exports = { predictCategory };
