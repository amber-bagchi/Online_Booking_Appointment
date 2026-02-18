const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // verify JWT
    const decoded = jwt.verify(token, "SECRET_KEY");

    // fetch user from DB
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium, // <-- REQUIRED for financial download
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
