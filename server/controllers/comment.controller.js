import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Redis from "../lib/redis.js";

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // take user id from cookies in refresh token
    const refreshToken = req.cookies.refreshToken;
    let userId;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const storedToken = await Redis.get("refreshToken:" + decoded.userId);

      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      userId = decoded.userId;
    }

    // Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Required fields validation
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
    });

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.log("Error in createcomment controller", error.message);
    res.status(500).json({ message: error.message, location: "createcomment" });
  }
};
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get user ID from cookies in refresh token
    const refreshToken = req.cookies.refreshToken;
    let userId;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const storedToken = await Redis.get("refreshToken:" + decoded.userId);

      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      userId = decoded.userId;
    }

    // Fetch user's comments on the post
    const userComments = userId
      ? await Comment.find({ post: postId, author: userId }).sort({
          createdAt: -1,
        })
      : [];

    // Fetch other comments on the post
    const otherComments = await Comment.find({
      post: postId,
      author: { $ne: userId },
    }).sort({ createdAt: -1 });

    // Combine comments with user's comments first, then other comments
    const comments = [...userComments, ...otherComments];

    res.status(200).json({
      message: `${comments.length} comment(s) fetched successfully`,
      comments,
    });
  } catch (error) {
    console.log("Error in getComments controller", error.message);
    res.status(500).json({ message: error.message, location: "getComments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error in deletecomment controller", error.message);
    res.status(500).json({ message: error.message, location: "deletecomment" });
  }
};

// just for develloppement
export const deleteAllComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete all comments on the post
    const deletedComments = await Comment.deleteMany({ post: postId });

    res.status(200).json({
      message: deletedComments.deletedCount + " comments deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteallcomments controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "deleteallcomments" });
  }
};

export const PlusVoteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update comment
    await Comment.findByIdAndUpdate(commentId, { votes: comment.votes + 1 });

    res.status(200).json({
      message: `Comment updated successfully, its now ${
        comment.votes + 1
      } votes`,
    });
  } catch (error) {
    console.log("Error in plusvotecomment controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "plusvotecomment" });
  }
};

export const MinusVoteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update comment
    await Comment.findByIdAndUpdate(commentId, { votes: comment.votes - 1 });

    res.status(200).json({
      message: `Comment updated successfully, its now ${
        comment.votes - 1
      } votes`,
    });
  } catch (error) {
    console.log("Error in minusvotecomment controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "minusvotecomment" });
  }
};
