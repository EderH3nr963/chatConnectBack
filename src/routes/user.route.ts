import UserController from "../controllers/user.controller";
import express from "express";
import {
  requestUpdateEmailValidator,
  confirmUpdateEmailValidator,
  updatePasswordValidator,
  updateUsernameValidator,
  handleValidationErrors,
} from "../middlewares/validators";

const router = express.Router();

// Perfil do usuário
router.get("/me", UserController.getById);

// Atualização de dados
router.patch(
  "/me/email",
  confirmUpdateEmailValidator,
  handleValidationErrors,
  UserController.confirmUpdateEmail
);
router.patch(
  "/me/password",
  updatePasswordValidator,
  handleValidationErrors,
  UserController.updatePassword
);
router.patch(
  "/me/username",
  updateUsernameValidator,
  handleValidationErrors,
  UserController.updateUsername
);

// Solicitação de atualização de email (envia token)
router.post(
  "/me/request-update-email",
  requestUpdateEmailValidator,
  handleValidationErrors,
  UserController.requestUpdateEmail
);

// Remover conta
router.delete("/me", UserController.delete);

export default router;
