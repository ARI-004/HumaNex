import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// Protected route: check current user
router.get("/me", authenticateToken, AuthController.getMe);

// Role-protected test routes for authorization verification
router.get(
  "/patient-only",
  authenticateToken,
  authorizeRoles("patient"),
  AuthController.checkRole
);

router.get(
  "/doctor-only",
  authenticateToken,
  authorizeRoles("doctor"),
  AuthController.checkRole
);

router.get(
  "/hospital-only",
  authenticateToken,
  authorizeRoles("hospital"),
  AuthController.checkRole
);

export default router;
