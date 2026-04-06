import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  likePost,
  sharePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getPosts);

// Private
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

// Private interactions
router.post("/:id/like", protect, likePost);
router.post("/:id/share", protect, sharePost);

export default router;