const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const expenseRoutes = require("./expenseRoutes");
const aiRoutes = require("./aiRoutes");

router.use("/users", userRoutes);
router.use("/expenses", expenseRoutes);
router.use("/ai", aiRoutes); 
module.exports = router;
