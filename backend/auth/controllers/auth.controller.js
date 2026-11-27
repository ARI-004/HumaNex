import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "humanex_secret_jwt_key_2026_super_secure";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Helper to sign JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const AuthController = {
  /**
   * User Registration (Sign up)
   */
  async signup(req, res) {
    try {
      const { name, email, password, role, extra } = req.body;

      // Validation
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "Full name, email, password, and role are required.",
        });
      }

      const validRoles = ["patient", "doctor", "hospital"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role '${role}'. Must be one of: ${validRoles.join(", ")}`,
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email address already exists.",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in MySQL
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
        extra: extra || null,
      });

      // Generate JWT
      const token = generateToken(newUser);

      // Set cookie
      res.cookie("token", token, cookieOptions);

      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          extra: newUser.extra,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed. " + error.message,
      });
    }
  },

  /**
   * User Login (Sign in)
   */
  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // If a specific role was requested in login, check role match
      if (role && user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `This account is registered as '${user.role}', but you selected '${role}'. Please switch to the ${user.role} tab.`,
        });
      }

      // Generate token
      const token = generateToken(user);

      // Set cookie
      res.cookie("token", token, cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          extra: user.extra,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Login failed. " + error.message,
      });
    }
  },

  /**
   * User Logout
   */
  async logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed: " + error.message,
      });
    }
  },

  /**
   * Get Current Authenticated User profile
   */
  async getMe(req, res) {
    try {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user profile.",
      });
    }
  },

  /**
   * Verify Role Endpoint (tests authorization)
   */
  async checkRole(req, res) {
    return res.status(200).json({
      success: true,
      message: `Authorized access granted for role: ${req.user.role}`,
      user: req.user,
    });
  }
};
