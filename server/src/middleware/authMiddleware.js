import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect routes: Authenticates incoming request using Bearer JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from Bearer string
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const secret = process.env.JWT_SECRET || "default_jwt_secret_mini_ecommerce_demo";
      const decoded = jwt.verify(token, secret);

      // Find user by ID and attach to request object (omit password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or account has been removed"
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("[AuthMiddleware Error]:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token validation failed"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no bearer token provided"
    });
  }
};
