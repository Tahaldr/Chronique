import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
  deleteAllComments,
  PlusVoteComment,
  MinusVoteComment,
} from "../controllers/comment.controller.js";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createcomment/:postId", protectedRoute, createComment);
router.get("/getcomments/:postId", protectedRoute, getComments);
router.delete("/deletecomment/:commentId", protectedRoute, deleteComment);
// just for develloppement
router.delete("/deleteallcomments/:postId", protectedRoute, adminRoute, deleteAllComments);
router.post("/plusvote/:commentId", protectedRoute, PlusVoteComment);
router.post("/minusvote/:commentId", protectedRoute, MinusVoteComment);

export default router;