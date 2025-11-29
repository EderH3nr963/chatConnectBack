import { body, param } from "express-validator";

export const chatIdValidator = [
  param("chatId")
    .notEmpty()
    .withMessage("ID do chat é obrigatório")
    .isString()
    .withMessage("ID do chat deve ser uma string"),
];

export const createPrivateChatValidator = [
  body("otherUserId")
    .notEmpty()
    .withMessage("ID do outro usuário é obrigatório")
    .isString()
    .withMessage("ID do usuário deve ser uma string"),
];

export const createGroupChatValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título do grupo é obrigatório")
    .isLength({ min: 1, max: 100 })
    .withMessage("Título deve ter entre 1 e 100 caracteres"),

  body("members")
    .isArray({ min: 1 })
    .withMessage("Deve ter pelo menos um membro no grupo")
    .custom((members) => {
      if (!Array.isArray(members)) {
        throw new Error("Members deve ser um array");
      }
      if (members.length === 0) {
        throw new Error("Deve ter pelo menos um membro no grupo");
      }
      const allStrings = members.every((member) => typeof member === "string");
      if (!allStrings) {
        throw new Error("Todos os IDs dos membros devem ser strings");
      }
      return true;
    }),
];

export const updateChatValidator = [
  param("chatId")
    .notEmpty()
    .withMessage("ID do chat é obrigatório")
    .isString()
    .withMessage("ID do chat deve ser uma string"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Título deve ter entre 1 e 100 caracteres"),
];
