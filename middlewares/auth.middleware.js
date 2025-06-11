import jwt from "jsonwebtoken";
import User from "../models/User.Model.js";
import {config} from 'dotenv'
config()

const JWT_SECRET = process.env.JWT_SECRET

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from cookies
    if (req.cookies?.token) {
      token = req.cookies.token;

    // 2. Get token from Authorization header (Bearer token)
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

    // 3. Get token from custom header
    } else if (req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    // No token found
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();

  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Only [${allowedRoles.join(", ")}] allowed`,
      });
    }
    next();
  };
};