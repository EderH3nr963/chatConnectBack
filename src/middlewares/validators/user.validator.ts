import { body, query } from "express-validator";

export const requestUpdateEmailValidator = [
  body("newEmail")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Novo email é obrigatório"),
];

export const confirmUpdateEmailValidator = [
  query("token")
    .notEmpty()
    .withMessage("Token é obrigatório")
    .isString()
    .withMessage("Token deve ser uma string"),
];

export const updatePasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),
];

export const updateUsernameValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username é obrigatório")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username deve ter entre 3 e 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username só pode conter letras, números e underscore"),
];
