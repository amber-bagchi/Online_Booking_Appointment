const router = require("express").Router();
const ctrl = require("../controllers/expenseController");
const auth = require("../middelware/authMiddleware");

router.get("/getExpense", auth, ctrl.getExpenses);
router.post("/addExpense", auth, ctrl.createExpense);
router.delete("/deleteExpense/:id", auth, ctrl.deleteExpense);

module.exports = router;
