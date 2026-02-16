const jwt = require("jsonwebtoken");

module.exports = (userId) => {
  return jwt.sign({ id: userId }, "SECRET_KEY", { expiresIn: "7d" });
};
