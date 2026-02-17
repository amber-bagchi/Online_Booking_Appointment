const router = require("express").Router();
const ctrl = require("../controllers/passwordController");

router.post("/forgot-password", ctrl.forgotPassword);
router.post("/verify-otp", ctrl.verifyOTP);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
