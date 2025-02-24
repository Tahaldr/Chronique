import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from "../lib/redis.js";

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
      const storedToken = await redis.get("refreshToken:" + decoded.userId);

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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10);
    const skip = (page - 1) * limit;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let userId = null;
    let userComments = [];
    let otherComments = [];

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const storedToken = await redis.get("refreshToken:" + decoded.userId);

        if (storedToken === refreshToken) {
          userId = decoded.userId;

          userComments = await Comment.find({ post: postId, author: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        }
      } catch (error) {
        console.log("Error verifying token:", error.message);
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }
    }

    if (userId) {
      otherComments = await Comment.find({
        post: postId,
        author: { $ne: userId },
      })
        .sort({ votes: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      otherComments = await Comment.find({ post: postId })
        .sort({ votes: -1 })
        .skip(skip)
        .limit(limit);
    }

    const totalComments = await Comment.countDocuments({ post: postId });
    const totalPages = Math.ceil(totalComments / limit);
    const hasMore = page * limit < totalComments;

    const comments = [...userComments, ...otherComments];

    res.status(200).json({
      message: `${comments.length} comment(s) fetched successfully`,
      comments,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
      totalPages,
      totalComments, // Added totalComments here
    });
  } catch (error) {
    console.log("Error in getComments controller", error.message);
    res.status(500).json({ message: error.message, location: "getComments" });
  }
};
F

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
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if the user has already voted for the comment
      if (comment.votes.includes(decoded.userId)) {
        return res
          .status(400)
          .json({ message: "You have already voted for this comment" });
      }

      comment.votes.push(decoded.userId);
      await comment.save();

      res.status(200).json({ message: "Comment voted successfully", comment });
    }
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
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if the user has not voted yet
      if (!comment.votes.includes(decoded.userId)) {
        return res
          .status(400)
          .json({ message: "You have not voted for this comment yet" });
      }

      comment.votes = comment.votes.filter(
        (vote) => vote.toString() !== decoded.userId.toString()
      );
      await comment.save();

      res.status(200).json({ message: "Vote removed successfully", comment });
    }
  } catch (error) {
    console.log("Error in minusvotecomment controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "minusvotecomment" });
  }
};
