import UserController from "../controllers/user.controller";
import express from "express";

const router = express.Router();

// Perfil do usuário
router.get("/me", UserController.getById);

// Atualização de dados
router.patch("/me/email", UserController.confirmUpdateEmail);
router.patch("/me/password", UserController.updatePassword);
router.patch("/me/username", UserController.updateUsername);

// Solicitação de atualização de email (envia token)
router.get("/me/request-update-email", UserController.requestUpdateEmail);

// Remover conta
router.delete("/me", UserController.delete);

export default router;
