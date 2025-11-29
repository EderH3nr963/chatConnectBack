import ChatController from "../controllers/chat.controller";
import ChatMemberController from "../controllers/chatMember.controller";
import express from "express";
import {
  createPrivateChatValidator,
  createGroupChatValidator,
  updateChatValidator,
  chatIdValidator as chatIdParamValidator,
  addMemberValidator,
  updateRoleValidator,
  memberIdValidator,
  handleValidationErrors,
} from "../middlewares/validators";

const router = express.Router();

router.post(
  "/groups",
  createGroupChatValidator,
  handleValidationErrors,
  ChatController.createGroup
);
router.post(
  "/private",
  createPrivateChatValidator,
  handleValidationErrors,
  ChatController.createPrivateChat
);

router.put(
  "/:chatId",
  updateChatValidator,
  handleValidationErrors,
  ChatController.updateChat
);
router.get("/", ChatController.listUserChats);
router.get(
  "/:chatId",
  chatIdParamValidator,
  handleValidationErrors,
  ChatController.getById
);

router.delete(
  "/:chatId",
  chatIdParamValidator,
  handleValidationErrors,
  ChatController.delete
);

router.get(
  "/:chatId/members",
  chatIdParamValidator,
  handleValidationErrors,
  ChatMemberController.listMembers
);

router.post(
  "/:chatId/members",
  addMemberValidator,
  handleValidationErrors,
  ChatMemberController.addMember
);

router.patch(
  "/:chatId/members/:memberId/role",
  updateRoleValidator,
  handleValidationErrors,
  ChatMemberController.updateRole
);

router.delete(
  "/:chatId/members/:memberId",
  chatIdParamValidator,
  memberIdValidator,
  handleValidationErrors,
  ChatMemberController.removeMember
);
router.delete(
  "/:chatId/leave",
  chatIdParamValidator,
  handleValidationErrors,
  ChatMemberController.leaveChat
);

export default router;
