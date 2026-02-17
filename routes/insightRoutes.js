const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/insightController");

router.get("/monthly-insight", auth, ctrl.getAIInsight);

module.exports = router;
