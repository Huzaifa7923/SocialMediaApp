import express from "express";

const router = express.Router();

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth";

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

//update
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
