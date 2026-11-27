import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "humanex_secret_jwt_key_2026_super_secure";

/**
 * Authentication Middleware:
 * Verifies JWT token from Authorization header or cookie.
 */
export async function authenticateToken(req, res, next) {
  try {
    let token = null;

    // Check Bearer token in Authorization header
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      // Check HTTP-only cookie
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired authentication token.",
        });
      }

      // Optionally fetch fresh user data from DB
      try {
        const user = await UserModel.findById(decoded.id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User account no longer exists.",
          });
        }
        req.user = user;
        next();
      } catch (dbErr) {
        // Fallback to token payload if DB query fails temporarily
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
      error: error.message,
    });
  }
}

/**
 * Authorization Middleware:
 * Verifies that the authenticated user possesses one of the required roles.
 * @param  {...string} allowedRoles - E.g. 'patient', 'doctor', 'hospital'
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please sign in first.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${allowedRoles.join(", ")}]. Your role is '${req.user.role}'.`,
      });
    }

    next();
  };
}
