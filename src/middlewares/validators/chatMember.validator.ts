import { body, param } from "express-validator";

export const memberIdValidator = [
  param("memberId")
    .notEmpty()
    .withMessage("ID do membro é obrigatório")
    .isString()
    .withMessage("ID do membro deve ser uma string"),
];

export const addMemberValidator = [
  param("chatId")
    .notEmpty()
    .withMessage("ID do chat é obrigatório")
    .isString()
    .withMessage("ID do chat deve ser uma string"),

  body("userId")
    .notEmpty()
    .withMessage("ID do usuário é obrigatório")
    .isString()
    .withMessage("ID do usuário deve ser uma string"),

  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Role deve ser 'admin' ou 'member'"),
];

export const updateRoleValidator = [
  param("chatId")
    .notEmpty()
    .withMessage("ID do chat é obrigatório")
    .isString()
    .withMessage("ID do chat deve ser uma string"),

  param("memberId")
    .notEmpty()
    .withMessage("ID do membro é obrigatório")
    .isString()
    .withMessage("ID do membro deve ser uma string"),

  body("newRole")
    .notEmpty()
    .withMessage("Nova role é obrigatória")
    .isIn(["admin", "member"])
    .withMessage("Role deve ser 'admin' ou 'member'"),
];
