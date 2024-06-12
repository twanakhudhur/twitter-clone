import express from "express";
import { protectedRoute } from "../middlware/protectedRoute.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.post("/update", protectedRoute, updateUserProfile);

export default router;
