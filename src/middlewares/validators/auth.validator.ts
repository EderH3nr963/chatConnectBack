import { body } from "express-validator";

export const registerValidator = [
  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email é obrigatório"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username é obrigatório")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username deve ter entre 3 e 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username só pode conter letras, números e underscore"),

  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email é obrigatório"),

  body("password").notEmpty().withMessage("Senha é obrigatória"),
];

export const requestUpdatePasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email é obrigatório"),
];
