const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Expense = sequelize.define("Expense", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },

  category: { type: DataTypes.STRING, allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false },
  payment: { type: DataTypes.STRING, allowNull: false },

  date: { type: DataTypes.DATEONLY, allowNull: false },
});

module.exports = Expense;
