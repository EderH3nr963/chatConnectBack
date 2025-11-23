import ChatController from "../controllers/chat.controller";
import ChatMemberController from "../controllers/chatMember.controller";
import express from "express";

const router = express.Router();

router.post("/groups", ChatController.createGroup);
router.post("/private", ChatController.createPrivateChat);

router.put("/:chatId", ChatController.updateChat);
router.get("/", ChatController.listUserChats);
router.get("/:chatId", ChatController.getById);

router.delete("/:chatId", ChatController.delete);

router.get("/:chatId/members", ChatMemberController.listMembers);

router.post("/:chatId/members", ChatMemberController.addMember);

router.patch(
  "/:chatId/members/:memberId/role",
  ChatMemberController.updateRole
);

router.delete("/:chatId/members/:memberId", ChatMemberController.removeMember);
router.delete("/:chatId/leave", ChatMemberController.leaveChat);

export default router;
