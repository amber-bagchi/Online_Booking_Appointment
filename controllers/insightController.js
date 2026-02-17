const { Expense } = require("../models");
const { Sequelize } = require("sequelize");
const { generateInsight } = require("../services/insightServices");

const getAIInsight = async (req, res) => {
  try {
    const userId = req.user.id;

    /* Monthly total */
    const monthly = await Expense.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("date")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: { UserId: userId },
      group: [Sequelize.fn("MONTH", Sequelize.col("date"))],
      raw: true,
    });

    /* Category total */
    const category = await Expense.findAll({
      attributes: [
        "category",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: { UserId: userId },
      group: ["category"],
      raw: true,
    });

    const summaryText = `
Monthly Totals: ${JSON.stringify(monthly)}
Category Totals: ${JSON.stringify(category)}
`;

    const insight = await generateInsight(summaryText);

    res.json({ insight });

  } catch (err) {
    console.error("AI Insight Error:", err);
    res.status(500).json({ message: "Failed to generate AI insight" });
  }
};

module.exports = { getAIInsight };
