const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const expenseRoutes = require("./expenseRoutes");
const aiRoutes = require("./aiRoutes");
const insightRoutes = require("./insightRoutes");
const passwordRoutes = require("./passwordRoutes");




router.use("/users", userRoutes);
router.use("/expenses", expenseRoutes);
router.use("/ai", aiRoutes); 
router.use("/insight", insightRoutes);
router.use("/password", passwordRoutes);

module.exports = router;
