const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check for the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Now you can access req.admin.id in your routes
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};