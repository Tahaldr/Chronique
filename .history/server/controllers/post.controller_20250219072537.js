import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../lib/cloudinary.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { title, description, content, category, tags } = req.body;
    const { author } = req.params;

    // Check if author exists
    const authorFound = await User.findById(author);

    if (!authorFound) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Required fields validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // upload image to cloudinary
    let cloundinaryResponse = null;
    if (req.file && req.file.path) {
      // Ensure the file is below 10 MB
      if (req.file.size > 10 * 1024 * 1024) {
        return res
          .status(400)
          .send({ message: "File size should not exceed 10 MB" });
      }

      cloundinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "postique/posts",
      });
    }

    const newPost = await Post.create({
      postPic: cloundinaryResponse?.secure_url || "null",
      title,
      author,
      description,
      content,
      category,
      tags,
    });

    res.status(200).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.log("Error in createpost controller", error.message);
    res.status(500).json({ message: error.message, location: "createpost" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    // Aggregation pipeline for sorting and pagination
    const posts = await Post.aggregate([
      {
        $addFields: { likeCount: { $size: "$likes" } }, // Add a field for the count of likes
      },
      {
        $sort: { likeCount: -1, createdAt: -1 }, // Sort by likeCount (desc) and createdAt (desc) as a secondary sort
      },
      {
        $skip: skip, // Skip documents for pagination
      },
      {
        $limit: limit, // Limit the number of documents returned
      },
    ]);

    // Count total posts for pagination metadata
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit); // Calculate total pages
    const hasMore = page * limit < totalPosts; // Check if there are more pages

    res.status(200).json({
      message: `${posts.length} post(s) fetched successfully`,
      posts,
      nextPage: hasMore ? page + 1 : null, // Include nextPage if there are more posts
      hasMore,
      totalPages, // Return total pages
    });
  } catch (error) {
    console.error("Error in getAllPosts controller:", error.message);
    res.status(500).json({ message: error.message, location: "getAllPosts" });
  }
};

// Get top writers with limit that i can change
export const getTopWriters = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;

    const topWriters = await Post.aggregate([
      // Unwind likes array to count individual likes
      {
        $unwind: "$likes",
      },
      // Group by author to sum all their likes
      {
        $group: {
          _id: "$author", // Group by author ID
          totalLikes: { $sum: 1 }, // Count likes
        },
      },
      // Sort authors by total likes in descending order
      {
        $sort: { totalLikes: -1 },
      },
      // Limit the result to top 'n' authors
      {
        $limit: limit,
      },
      // Optionally lookup author details (if needed)
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "_id",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      // Optionally clean up authorDetails (if needed)
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          totalLikes: 1,
          authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
        },
      },
    ]);

    res.status(200).json({
      message: `${topWriters.length} writer(s) fetched successfully`,
      topWriters,
    });
  } catch (error) {
    console.error("Error in getTopWriters controller:", error.message);
    res.status(500).json({ message: error.message, location: "getTopWriters" });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    // Extract limit from query parameters, if provided
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Build the aggregation pipeline
    const pipeline = [
      {
        $addFields: { likeCount: { $size: "$likes" } }, // Add a field with the count of likes
      },
      {
        $sort: { createdAt: -1 }, // Sort by creation date in descending order
      },
    ];

    // Apply limit only if it's provided
    if (limit) {
      pipeline.push({ $limit: limit });
    }

    // Execute the aggregation pipeline
    const posts = await Post.aggregate(pipeline);

    res
      .status(200)
      .json({ message: `${posts.length} post(s) fetched successfully`, posts });
  } catch (error) {
    console.error("Error in getRecentPosts controller:", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "getRecentPosts" });
  }
};

export const getAuthorPosts = async (req, res) => {
  try {
    const { author } = req.params;

    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    // Convert `author` to ObjectId if necessary
    const authorId = mongoose.Types.ObjectId.isValid(author)
      ? new mongoose.Types.ObjectId(author)
      : author;

    // Aggregation pipeline
    const posts = await Post.aggregate([
      {
        $match: { author: authorId }, // Ensure proper matching
      },
      {
        $addFields: { likeCount: { $size: "$likes" } }, // Add a field for the count of likes
      },
      {
        $sort: { createdAt: -1 }, // Sort by `createdAt` in descending order
      },
      {
        $skip: skip, // Skip documents for pagination
      },
      {
        $limit: limit, // Limit the number of documents returned
      },
    ]);

    // Count total posts for the author
    const totalPosts = await Post.countDocuments({ author: authorId });
    const totalPages = Math.ceil(totalPosts / limit);
    const hasMore = page * limit < totalPosts;

    res.status(200).json({
      message: `${posts.length} post(s) fetched successfully`,
      posts,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
      totalPages,
    });
  } catch (error) {
    console.error("Error in getAuthorPosts controller:", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "getAuthorPosts" });
  }
};

export const getCategoryPosts = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    // Aggregation pipeline for category filtering, sorting, and pagination
    const posts = await Post.aggregate([
      {
        $match: { category }, // Filter posts by category
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" }, // Add a field for the length of the `likes` array
        },
      },
      {
        $sort: { likeCount: -1, createdAt: -1 }, // Sort by likeCount and createdAt
      },
      {
        $skip: skip, // Skip documents for pagination
      },
      {
        $limit: limit, // Limit the number of documents returned
      },
    ]);

    // Count total posts in the category for pagination metadata
    const totalPosts = await Post.countDocuments({ category });
    const totalPages = Math.ceil(totalPosts / limit); // Calculate total pages
    const hasMore = page * limit < totalPosts; // Check if there are more pages

    res.status(200).json({
      message: `${posts.length} Category post(s) fetched successfully`,
      category,
      posts,
      nextPage: hasMore ? page + 1 : null, // Include nextPage if there are more posts
      hasMore,
      totalPages, // Return total pages
    });
  } catch (error) {
    console.error("Error in getCategoryPosts controller:", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "getCategoryPosts" });
  }
};

export const getRelatedAuthorPosts = async (req, res) => {
  try {
    const { postId } = req.params;

    // Get the reference post
    const post = await Post.findById(postId).select(
      "author title description tags category votes"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { author, title, description, tags, category, votes } = post;

    // Convert `author` to ObjectId
    const authorId = mongoose.Types.ObjectId.isValid(author)
      ? new mongoose.Types.ObjectId(author)
      : author;

    // Step 1: Find similar posts by the same author
    let relatedPosts = await Post.find({
      author: authorId,
      _id: { $ne: postId }, // Exclude the current post
      $or: [
        { category },
        { tags: { $in: tags } },
        { title: { $regex: title.split(" ")[0], $options: "i" } },
        { description: { $regex: description.split(" ")[0], $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 }) // Newest first
      .limit(10);

    // Step 2: If no related posts, fetch highest-voted posts by the author
    if (relatedPosts.length === 0) {
      relatedPosts = await Post.find({ author: authorId, _id: { $ne: postId } })
        .sort({ votes: -1 }) // Sort by most votes
        .limit(10);
    }

    // Step 3: If the author has only this post, get top-voted posts from other users
    const authorPostCount = await Post.countDocuments({ author: authorId });
    if (authorPostCount === 1) {
      relatedPosts = await Post.find({ _id: { $ne: postId } })
        .sort({ votes: -1 }) // Sort by highest votes
        .limit(10);
    }

    res.status(200).json({
      message: `${relatedPosts.length} related post(s) found`,
      relatedPosts,
    });
  } catch (error) {
    console.error("Error in getRelatedAuthorPosts:", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "getRelatedAuthorPosts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).json({ message: "Post fetched successfully", post });
  } catch (error) {
    console.log("Error in getpost controller", error.message);
    res.status(500).json({ message: error.message, location: "getpost" });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const term = req.query.term || ""; // Default to an empty term
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    // Build the match stage for searching
    const matchStage = term
      ? {
          $or: [
            { title: { $regex: term, $options: "i" } },
            { description: { $regex: term, $options: "i" } },
            { tags: { $regex: term, $options: "i" } },
          ],
        }
      : {};

    // Aggregation pipeline
    const posts = await Post.aggregate([
      { $match: matchStage }, // Match posts by the search term
      { $addFields: { likeCount: { $size: "$likes" } } }, // Add a field for the count of likes
      { $sort: { likeCount: -1, createdAt: -1 } }, // Sort by likes (desc) and creation date (desc)
      { $skip: skip }, // Skip documents for pagination
      { $limit: limit }, // Limit the number of documents
    ]);

    // Count total posts matching the search term
    const totalPosts = await Post.countDocuments(matchStage);
    const totalPages = Math.ceil(totalPosts / limit); // Calculate total pages
    const hasMore = page * limit < totalPosts; // Check if there are more pages

    res.status(200).json({
      message: `${posts.length} post(s) fetched successfully`,
      posts,
      nextPage: hasMore ? page + 1 : null, // Include nextPage if there are more posts
      hasMore,
      totalPages, // Return total pages
    });
  } catch (error) {
    console.error("Error in searchPosts controller:", error.message);
    res.status(500).json({ message: error.message, location: "searchPosts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find and delete the post
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete all comments related to the post and get the count
    const deletedCount = await Comment.deleteMany({ post: postId });

    res.status(200).json({
      message: "Post and related comments deleted successfully",
      post,
      deletedComments: deletedCount,
    });
  } catch (error) {
    console.log("Error in deletePost controller", error.message);
    res.status(500).json({ message: error.message, location: "deletePost" });
  }
};

export const deleteAuthorPosts = async (req, res) => {
  try {
    const { author } = req.params;
    const posts = await Post.find({ author });
    for (const post of posts) {
      await Post.findByIdAndDelete(post._id);
    }
    res
      .status(200)
      .json({ message: posts.length + " Author posts deleted successfully" });
  } catch (error) {
    console.log("Error in deleteauthorposts controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "deleteauthorposts" });
  }
};

// just for developpement
export const deleteAllPosts = async (req, res) => {
  try {
    // Delete all posts
    const posts = await Post.find();
    for (const post of posts) {
      await Post.findByIdAndDelete(post._id);
    }
    res
      .status(200)
      .json({ message: posts.length + " post(s) deleted successfully" });
  } catch (error) {
    console.log("Error in deleteallposts controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "deleteallposts" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description, content, category, tags } = req.body;

    // Check if post exists
    const postFound = await Post.findById(postId);
    if (!postFound) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Required fields validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // upload image to cloudinary
    let cloundinaryResponse = null;
    if (req.file && req.file.path) {
      cloundinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "postique/posts",
      });
    }

    const post = await Post.findByIdAndUpdate(postId, {
      postPic: cloundinaryResponse?.secure_url || postFound.postPic,
      title: title,
      description: description,
      content: content,
      category: category,
      tags: tags,
    });

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.log("Error in updatepost controller", error.message);
    res.status(500).json({ message: error.message, location: "updatepost" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
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

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user has already liked the post
      if (post.likes.includes(decoded.userId)) {
        return res
          .status(400)
          .json({ message: "You have already liked this post" });
      }

      post.likes.push(decoded.userId);
      await post.save();

      res.status(200).json({ message: "Post liked successfully", post });
    }
  } catch (error) {
    console.log("Error in likepost controller", error.message);
    res.status(500).json({ message: error.message, location: "likepost" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
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

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user has already didnt like the post yet
      if (!post.likes.includes(decoded.userId)) {
        return res
          .status(400)
          .json({ message: "You have not liked this post yet" });
      }

      post.likes = post.likes.filter(
        (like) => like.toString() !== decoded.userId.toString()
      );
      await post.save();

      res.status(200).json({ message: "Post unliked successfully", post });
    }
  } catch (error) {
    console.log("Error in unlikepost controller", error.message);
    res.status(500).json({ message: error.message, location: "unlikepost" });
  }
};
