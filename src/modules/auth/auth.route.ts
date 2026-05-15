import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/google-login", AuthController.googleLogin);
router.post("/logout", AuthController.logoutUser);
router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;
