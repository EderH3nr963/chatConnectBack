import AuthController from "../controllers/auth.controller";
import express from "express";
import {
  registerValidator,
  loginValidator,
  requestUpdatePasswordValidator,
  handleValidationErrors,
} from "../middlewares/validators";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  AuthController.register
);
router.post(
  "/login",
  loginValidator,
  handleValidationErrors,
  AuthController.login
);
router.post(
  "/request-update-password",
  requestUpdatePasswordValidator,
  handleValidationErrors,
  AuthController.requestUpdatePassword
);

export default router;
