import express from "express";
import {
  createPost,
  getAllPosts,
  getTopWriters,
  getRecentPosts,
  getAuthorPosts,
  getCategoryPosts,
  getRelatedAuthorPosts,
  getPost,
  searchPosts,
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

router.post("/createpost", protectedRoute, createPost);
router.get("/getallposts", getAllPosts);
router.get("/topwriters", getTopWriters);
router.get("/getrecentposts", getRecentPosts);
router.get("/getauthorposts/:author", getAuthorPosts);
router.get("/getpost/:postId", getPost);
router.get("/getcategoryposts/:category", getCategoryPosts);
router.get("/getrelatedauthorposts/:postId", getRelatedAuthorPosts);
router.get("/searchposts", searchPosts);

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
