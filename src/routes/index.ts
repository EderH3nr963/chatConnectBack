import express from "express";

import UserRoutes from "./user.route";
import AuthRoutes from "./auth.route";
import ChatRoutes from "./chat.routes";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use("/user", authMiddleware, UserRoutes);
router.use("/chat", authMiddleware, ChatRoutes);
router.use("/auth", AuthRoutes);

export default router;
