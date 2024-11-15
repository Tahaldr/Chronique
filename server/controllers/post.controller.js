import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";

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
    const posts = await Post.find();
    res
      .status(200)
      .json({ message: posts.length + " post(s) fetched successfully", posts });
  } catch (error) {
    console.log("Error in getallposts controller", error.message);
    res.status(500).json({ message: error.message, location: "getallposts" });
  }
};

export const getAuthorPosts = async (req, res) => {
  try {
    const { author } = req.params;
    const posts = await Post.find({ author });
    res.status(200).json({
      message: posts.length + " Author posts fetched successfully",
      posts: posts,
    });
  } catch (error) {
    console.log("Error in getauthorposts controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "getauthorposts" });
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

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    console.log("Error in deletepost controller", error.message);
    res.status(500).json({ message: error.message, location: "deletepost" });
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
