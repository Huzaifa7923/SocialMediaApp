import express from "express";
const router = express.Router();

import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/post", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);

export default router;
