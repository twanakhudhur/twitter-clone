import express from "express";
import { protectedRoute } from "../middlware/protectedRoute.js";
import { commenOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeAndUnlike } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.post("/create", protectedRoute, createPost);
router.delete("/delete/:id", protectedRoute, deletePost);
router.post("/comment/:id", protectedRoute, commenOnPost);
router.post("/like/:id", protectedRoute, likeAndUnlike);

export default router;
