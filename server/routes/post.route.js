import express from "express";
import {
  createPost,
  getAllPosts,
  getRecentPosts,
  getAuthorPosts,
  getCategoryPosts,
  getPost,
  deletePost,
  deleteAuthorPosts,
  deleteAllPosts,
  updatePost,
  likePost,
  unlikePost,
} from "../controllers/post.controller.js";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import multerUpload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/createpost/:author",
  protectedRoute,
  multerUpload.single("postPic"),
  createPost
);
router.get("/getallposts", protectedRoute, getAllPosts);
router.get("/getrecentposts", protectedRoute, getRecentPosts);
router.get("/getauthorposts/:author", protectedRoute, getAuthorPosts);
router.get("/getpost/:postId", protectedRoute, getPost);
router.get("/getcategoryposts/:category", protectedRoute, getCategoryPosts);

router.delete("/deletepost/:postId", protectedRoute, deletePost);
router.delete("/deleteauthorposts/:author", protectedRoute, deleteAuthorPosts);

// Delete all posts - just for development purposes
router.delete("/deleteallposts", protectedRoute, adminRoute, deleteAllPosts);

router.put(
  "/updatepost/:postId",
  protectedRoute,
  multerUpload.single("postPic"),
  updatePost
);
router.post("/likepost/:postId", protectedRoute, likePost);
router.post("/unlikepost/:postId", protectedRoute, unlikePost);

export default router;
