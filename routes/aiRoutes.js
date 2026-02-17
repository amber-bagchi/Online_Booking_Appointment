const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/aiController");

router.post("/predict-category", auth, ctrl.getCategoryPrediction);

module.exports = router;
