const router = require("express").Router();
const ctrl = require("../controllers/expenseController");
const auth = require("../middleware/authMiddleware");

router.get("/getExpense", auth, ctrl.getExpenses);
router.post("/addExpense", auth, ctrl.createExpense);
router.delete("/deleteExpense/:id", auth, ctrl.deleteExpense);
router.get("/leaderboard", auth, ctrl.getLeaderboard);

module.exports = router;

