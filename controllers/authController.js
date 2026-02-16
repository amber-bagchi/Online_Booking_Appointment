const { Expense, User } = require("../models");
const { Sequelize } = require("sequelize");

/* ===== GET USER EXPENSES ===== */
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

/* ===== CREATE EXPENSE ===== */
const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      UserId: req.user.id,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create expense" });
  }
};

/* ===== DELETE EXPENSE ===== */
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

/* ===== FIXED LEADERBOARD ===== */
const getLeaderboard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("Expenses.amount")),
            0
          ),
          "total_cost",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
          required: false, // IMPORTANT → keeps users with 0 expenses
        },
      ],
      group: ["User.id"],
      order: [[Sequelize.literal("total_cost"), "DESC"]],
    });

    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  getLeaderboard,
};
