const { Expense, User } = require("../models");
const { Sequelize } = require("sequelize");
const sequelize = require("../utils/db");
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


const createExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const expense = await Expense.create(
      { ...req.body, UserId: req.user.id },
      { transaction: t }
    );

    await User.increment("total_cost", {
      by: Number(req.body.amount),
      where: { id: req.user.id },
      transaction: t,
    });

    await t.commit();
    res.status(201).json(expense);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to create expense" });
  }
};


const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, UserId: req.user.id },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    await User.decrement("total_cost", {
      by: expense.amount,
      where: { id: req.user.id },
      transaction: t,
    });

    await expense.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};


const getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "total_cost"],
      order: [["total_cost", "DESC"]],
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};

/* ===== PAGINATED EXPENSES ===== */
const getPaginatedExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where: { UserId: req.user.id },
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalExpenses: count,
      expenses: rows,
    });
  } catch (err) {
    console.error("PAGINATION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch paginated expenses" });
  }
};



module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  getLeaderboard,
  getPaginatedExpenses
};
