const { Expense } = require("../models");
const { Op, Sequelize } = require("sequelize");

/* ================= HELPER ================= */
function groupByPeriod(expenses, type) {
  const grouped = {};

  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    let key;

    if (type === "daily") {
      key = date.toISOString().split("T")[0];
    }

    if (type === "weekly") {
      const first = new Date(date);
      first.setDate(date.getDate() - date.getDay());
      key = "Week of " + first.toISOString().split("T")[0];
    }

    if (type === "monthly") {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    if (type === "yearly") {
      key = `${date.getFullYear()}`;
    }

    grouped[key] = (grouped[key] || 0) + Number(exp.amount);
  });

  return grouped;
}

/* ================= GET SUMMARY ================= */
exports.getSummary = async (req, res) => {
  try {
    const { type } = req.query;

    if (!["daily", "weekly", "monthly", "yearly"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const expenses = await Expense.findAll({
      where: { UserId: req.user.id },
      attributes: ["amount", "date"],
      order: [["date", "DESC"]],
    });

    const grouped = groupByPeriod(expenses, type);

    res.json(grouped);
  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

/* ================= DOWNLOAD REPORT (PREMIUM) ================= */
exports.downloadReport = async (req, res) => {
  try {
    // 🔒 PREMIUM CHECK (frontend flag for now)
    if (!req.user.isPremium) {
      return res.status(403).json({ message: "Premium required" });
    }

    const expenses = await Expense.findAll({
      where: { UserId: req.user.id },
      attributes: ["amount", "description", "category", "date"],
      order: [["date", "DESC"]],
    });

    let text = "Financial Report\n\n";

    expenses.forEach((e) => {
      text += `${e.date} | ₹${e.amount} | ${e.category} | ${e.description}\n`;
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=financial-report.txt"
    );
    res.setHeader("Content-Type", "text/plain");

    res.send(text);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Failed to download report" });
  }
};
