import express from "express";
import {
  followUser,
  unfollowUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/:id", getUserProfile);

// Private
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

export default router;