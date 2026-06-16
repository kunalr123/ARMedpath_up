const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT from the Authorization header and attaches the user.
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Optional auth: attaches user if a valid token is present, otherwise continues.
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (header.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (err) {
    // ignore invalid token for optional routes
  }
  next();
};

module.exports = { protect, optionalAuth };
