import authRoutes from "./routes/auth.routes.js";
import { pool, initDB } from "./config/db.js";
import { authenticateToken, authorizeRoles } from "./middleware/auth.middleware.js";
import { AuthController } from "./controllers/auth.controller.js";
import { UserModel } from "./models/user.model.js";

export {
  authRoutes,
  pool,
  initDB,
  authenticateToken,
  authorizeRoles,
  AuthController,
  UserModel,
};

export default authRoutes;
