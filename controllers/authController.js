const bcrypt = require("bcrypt");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");

/* ===== SIGNUP ===== */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(403).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hash });

  res.status(201).json({
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  });
};

/* ===== LOGIN ===== */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid password" });

  res.json({
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  });
};
