const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(403).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    /* ✅ GENERATE TOKEN AFTER SIGNUP (BEST PRACTICE) */
    const token = generateToken(user.id);

    res.status(201).json({
      status: "success",
      message: "Signup successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};


/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    /* ✅ GENERATE JWT TOKEN */
    const token = generateToken(user.id);

    /* ✅ SEND TOKEN IN RESPONSE */
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };
