import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  profile,
  googleLogin,
  refresh,
  getAllUsers,
} from "../controllers/user-controller.js";
import { isUser } from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/profile", isUser, profile);
router.post("/google-login", googleLogin);
router.post("/refresh", refresh);

router.get("/all", isUser, getAllUsers);

export default router;
