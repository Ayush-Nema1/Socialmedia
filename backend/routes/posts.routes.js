import { Router } from "express";
import {
  commentPost,
  createPost,
  delete_comment_of_user,
  deletePost,
  get_comment_by_post,
  getAllPosts,
  increment_like
} from "../controllers/posts.controllers.js";

import { uploadPost } from "../middleware/upload.middleware.js";

const router = Router();

/* ================= CREATE POST ================= */
router.post(
  "/posts",
  uploadPost.single("media"),   // 👈 Cloudinary upload
  createPost
);

/* ================= GET POSTS ================= */
router.get("/posts", getAllPosts);

/* ================= DELETE POST ================= */
router.delete("/delete_post", deletePost);

/* ================= COMMENTS ================= */
router.post("/comment", commentPost);
router.get("/get_comments", get_comment_by_post);
router.post("/delete_comment", delete_comment_of_user);

/* ================= LIKE ================= */
router.post("/like", increment_like);

export default router;