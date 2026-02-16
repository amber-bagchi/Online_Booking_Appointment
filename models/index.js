const User = require("./user");
const Expense = require("./expense");

User.hasMany(Expense, { foreignKey: "UserId" });
Expense.belongsTo(User, { foreignKey: "UserId" });

module.exports = { User, Expense };
