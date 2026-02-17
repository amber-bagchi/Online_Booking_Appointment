const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { sendOTPEmail } = require("../services/mailService");

/* ================= SEND OTP ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    /* Generate 6-digit OTP */
    const otp = crypto.randomInt(100000, 999999).toString();

    /* Hash OTP before storing */
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpiry =
      Date.now() + process.env.OTP_EXPIRE_MINUTES * 60 * 1000;

    await user.save();

    /* Send real OTP via email */
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ================= VERIFY OTP ================= */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.otp)
      return res.status(400).json({ message: "Invalid OTP request" });

    /* Check expiry */
    if (Date.now() > user.otpExpiry)
      return res.status(400).json({ message: "OTP expired" });

    /* Compare entered OTP with HASH */
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.otp)
      return res.status(400).json({ message: "Invalid request" });

    /* Check expiry */
    if (Date.now() > user.otpExpiry)
      return res.status(400).json({ message: "OTP expired" });

    /* Validate OTP hash */
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    /* Hash new password */
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    /* Clear OTP after successful reset */
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed" });
  }
};

module.exports = { forgotPassword, verifyOTP, resetPassword };
