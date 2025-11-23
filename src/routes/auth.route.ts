import AuthController from "../controllers/auth.controller";
import express from "express";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/request-update-password", AuthController.requestUpdatePassword);

export default router;
