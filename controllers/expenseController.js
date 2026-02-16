const { Expense } = require("../models");

/* ===== GET ALL ===== */
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
  res.json(expenses);
};

/* ===== CREATE ===== */
exports.createExpense = async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    UserId: req.user.id,
  });

  res.status(201).json(expense);
};

/* ===== DELETE ===== */
exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findOne({
    where: { id: req.params.id, UserId: req.user.id },
  });

  if (!expense) return res.status(404).json({ message: "Expense not found" });

  await expense.destroy();
  res.json({ message: "Deleted successfully" });
};
