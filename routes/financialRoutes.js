const router = require("express").Router();
const financialController = require("../controllers/financialController");
const auth = require("../middleware/authMiddleware");

/* SUMMARY */
router.get("/summary", auth, financialController.getSummary);

/* DOWNLOAD REPORT (PREMIUM) */
router.get("/download", auth, financialController.downloadReport);

module.exports = router;
