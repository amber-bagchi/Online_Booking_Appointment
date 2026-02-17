const { predictCategory } = require("../services/aiService");

/* ===== AUTO CATEGORY ===== */
const getCategoryPrediction = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const category = await predictCategory(description);

    res.json({ category });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ message: "AI prediction failed" });
  }
};

module.exports = { getCategoryPrediction };
