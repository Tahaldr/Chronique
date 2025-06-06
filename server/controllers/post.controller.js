import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import cloudinary from '../lib/cloudinary.js';
import redis from '../lib/redis.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// export const createPost = async (req, res) => {
//   try {
//     const { title, description, content, category, tags } = req.body;
//     const { author } = req.params;

//     // Check if author exists
//     const authorFound = await User.findById(author);

//     if (!authorFound) {
//       return res.status(404).json({ message: "Author not found" });
//     }

//     // Required fields validation
//     if (!title) {
//       return res.status(400).json({ message: "Title is required" });
//     }

//     if (!description) {
//       return res.status(400).json({ message: "Description is required" });
//     }

//     if (!content) {
//       return res.status(400).json({ message: "Content is required" });
//     }

//     if (!category) {
//       return res.status(400).json({ message: "Category is required" });
//     }

//     // upload image to cloudinary
//     let cloundinaryResponse = null;
//     if (req.file && req.file.path) {
//       // Ensure the file is below 10 MB
//       if (req.file.size > 10 * 1024 * 1024) {
//         return res
//           .status(400)
//           .send({ message: "File size should not exceed 10 MB" });
//       }

//       cloundinaryResponse = await cloudinary.uploader.upload(req.file.path, {
//         folder: "postique/posts",
//       });
//     }

//     const newPost = await Post.create({
//       postPic: cloundinaryResponse?.secure_url || "null",
//       title,
//       author,
//       description,
//       content,
//       category,
//       tags,
//     });

//     res.status(200).json({ message: "Post created successfully", newPost });
//   } catch (error) {
//     console.log("Error in createpost controller", error.message);
//     res.status(500).json({ message: error.message, location: "createpost" });
//   }
// };

export const createPost = async (req, res) => {
  try {
    const { postPic, title, description, content, category, tags } = req.body;

    // Get user id from token

    const refreshToken = req.cookies.refreshToken;
    let userId;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized, Login first' });
      }
    } else {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const author = userId;

    // Check if author exists
    const authorFound = await User.findById(author);

    if (!authorFound) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Get post image size and validate
    if (postPic) {
      const imageSize = Buffer.byteLength(postPic, 'base64');
      const ImageSizeMb = imageSize / 1024 / 1024;
      // console.log(ImageSizeMb, "Mbs");
      if (ImageSizeMb > 10) {
        return res.status(400).json({ message: 'Max image size is 10mb' });
      }
    }

    // Required fields validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Upload image to cloudinary
    let cloundinaryResponse = null;
    if (postPic) {
      cloundinaryResponse = await cloudinary.uploader.upload(postPic, {
        folder: 'Chronique/posts',
      });
    }

    const newPost = await Post.create({
      postPic: cloundinaryResponse?.secure_url || 'null',
      title,
      author,
      description,
      content,
      category,
      tags,
    });

    res.status(200).json({ message: 'Post created successfully', newPost });
  } catch (error) {
    console.log('Error in createpost controller', error.message);
    res.status(500).json({ message: error.message, location: 'createpost' });
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
        $addFields: { likeCount: { $size: '$likes' } }, // Add a field for the count of likes
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
    console.error('Error in getAllPosts controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getAllPosts' });
  }
};

// Get top writers with limit that i can change
export const getTopWriters = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;

    const topWriters = await Post.aggregate([
      // Unwind likes array to count individual likes
      {
        $unwind: '$likes',
      },
      // Group by author to sum all their likes
      {
        $group: {
          _id: '$author', // Group by author ID
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
          from: 'users', // Replace with your actual user collection name
          localField: '_id',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      // Optionally clean up authorDetails (if needed)
      {
        $project: {
          _id: 0,
          authorId: '$_id',
          totalLikes: 1,
          authorDetails: { $arrayElemAt: ['$authorDetails', 0] },
        },
      },
    ]);

    res.status(200).json({
      message: `${topWriters.length} writer(s) fetched successfully`,
      topWriters,
    });
  } catch (error) {
    console.error('Error in getTopWriters controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getTopWriters' });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    // Extract limit from query parameters, if provided
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Build the aggregation pipeline
    const pipeline = [
      {
        $addFields: { likeCount: { $size: '$likes' } }, // Add a field with the count of likes
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

    res.status(200).json({ message: `${posts.length} post(s) fetched successfully`, posts });
  } catch (error) {
    console.error('Error in getRecentPosts controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getRecentPosts' });
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
        $addFields: { likeCount: { $size: '$likes' } }, // Add a field for the count of likes
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
    console.error('Error in getAuthorPosts controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getAuthorPosts' });
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
          likeCount: { $size: '$likes' }, // Add a field for the length of the `likes` array
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
    console.error('Error in getCategoryPosts controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getCategoryPosts' });
  }
};

const extractKeywords = (text) => {
  if (!text) return [];
  return (
    text
      .toLowerCase()
      .match(/\b[a-zA-Z]{3,}\b/g) // Extract words with at least 3 letters
      ?.filter(
        (word) =>
          ![
            'the',
            'and',
            'for',
            'with',
            'this',
            'that',
            'from',
            'into',
            'onto',
            'your',
            'their',
            'which',
            'what',
            'where',
            'when',
            'how',
            'why',
          ].includes(word) // Remove common words
      ) || []
  );
};

export const getRelatedAuthorPosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts

    const post = await Post.findById(postId).select(
      'author title description tags category votes postPic'
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { author, title, description, tags, postPic } = post;
    const authorId = mongoose.Types.ObjectId.isValid(author)
      ? new mongoose.Types.ObjectId(author)
      : author;
    const keywords = [...new Set([...extractKeywords(title), ...extractKeywords(description)])];

    let relatedPosts = await Post.find({
      _id: { $ne: postId },
      author: authorId,
      $or: [
        { tags: { $in: tags } },
        { title: { $regex: keywords.join('|'), $options: 'i' } },
        { description: { $regex: keywords.join('|'), $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Filter out posts where postPic is null
    relatedPosts = relatedPosts.filter((post) => post.postPic !== 'null');

    if (relatedPosts.length < limit) {
      const remaining = limit - relatedPosts.length;

      const moreFromAuthor = await Post.find({
        author: authorId,
        _id: { $nin: [...relatedPosts.map((p) => p._id), postId] },
      })
        .sort({ votes: -1 })
        .limit(remaining);

      relatedPosts = [...relatedPosts, ...moreFromAuthor];
    }

    if (relatedPosts.length < limit) {
      const remaining = limit - relatedPosts.length;

      const topVotedOthers = await Post.find({
        _id: { $nin: [...relatedPosts.map((p) => p._id), postId] },
      })
        .sort({ votes: -1 })
        .limit(remaining);

      relatedPosts = [...relatedPosts, ...topVotedOthers];
    }

    res.status(200).json({
      message: `${relatedPosts.length} related post(s) found`,
      posts: relatedPosts,
    });
  } catch (error) {
    console.error('Error in getRelatedAuthorPosts:', error.message);
    res.status(500).json({ message: error.message, location: 'getRelatedAuthorPosts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).json({ message: 'Post fetched successfully', post });
  } catch (error) {
    console.log('Error in getpost controller', error.message);
    res.status(500).json({ message: error.message, location: 'getpost' });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const term = req.query.term || ''; // Default to an empty term
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 posts per page
    const skip = (page - 1) * limit;

    // Build the match stage for searching
    const matchStage = term
      ? {
          $or: [
            { title: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
            { tags: { $regex: term, $options: 'i' } },
          ],
        }
      : {};

    // Aggregation pipeline
    const posts = await Post.aggregate([
      { $match: matchStage }, // Match posts by the search term
      { $addFields: { likeCount: { $size: '$likes' } } }, // Add a field for the count of likes
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
    console.error('Error in searchPosts controller:', error.message);
    res.status(500).json({ message: error.message, location: 'searchPosts' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find and delete the post
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete all comments related to the post and get the count
    const deletedCount = await Comment.deleteMany({ post: postId });

    res.status(200).json({
      message: 'Post and related comments deleted successfully',
      post,
      deletedComments: deletedCount,
    });
  } catch (error) {
    console.log('Error in deletePost controller', error.message);
    res.status(500).json({ message: error.message, location: 'deletePost' });
  }
};

export const deleteAuthorPosts = async (req, res) => {
  try {
    const { author } = req.params;

    // Find all posts by the author
    const posts = await Post.find({ author });
    const postIds = posts.map((post) => post._id);

    // Delete all found posts
    await Post.deleteMany({ author });

    // Delete all comments related to the author's posts
    await Comment.deleteMany({ post: { $in: postIds } });

    res.status(200).json({
      message: `${posts.length} author posts and their comments deleted successfully`,
    });
  } catch (error) {
    console.log('Error in deleteAuthorPosts controller', error.message);
    res.status(500).json({ message: error.message, location: 'deleteAuthorPosts' });
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
    res.status(200).json({ message: posts.length + ' post(s) deleted successfully' });
  } catch (error) {
    console.log('Error in deleteallposts controller', error.message);
    res.status(500).json({ message: error.message, location: 'deleteallposts' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { postPic, title, description, content, category, tags } = req.body;
    console.log(req.body);

    // Get user id from token
    const refreshToken = req.cookies.refreshToken;
    let userId;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized, Login first' });
      }
    } else {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Check if post exists
    const postFound = await Post.findById(postId);
    if (!postFound) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author
    if (postFound.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Validate image size
    if (postPic) {
      const imageSize = Buffer.byteLength(postPic, 'base64');
      const imageSizeMb = imageSize / 1024 / 1024;
      if (imageSizeMb > 10) {
        return res.status(400).json({ message: 'Max image size is 10MB' });
      }
    }

    // Required fields validation
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!description) return res.status(400).json({ message: 'Description is required' });
    if (!content) return res.status(400).json({ message: 'Content is required' });
    if (!category) return res.status(400).json({ message: 'Category is required' });

    // Upload image to Cloudinary if provided
    let cloudinaryResponse = null;
    if (postPic) {
      cloudinaryResponse = await cloudinary.uploader.upload(postPic, {
        folder: 'Chronique/posts',
      });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        postPic: cloudinaryResponse?.secure_url || postFound.postPic,
        title,
        description,
        content,
        category,
        tags,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    console.log('Error in updatePost controller', error.message);
    res.status(500).json({ message: error.message, location: 'updatePost' });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if the user has already liked the post
      if (post.likes.includes(decoded.userId)) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }

      post.likes.push(decoded.userId);
      await post.save();

      res.status(200).json({ message: 'Post liked successfully', post });
    }
  } catch (error) {
    console.log('Error in likepost controller', error.message);
    res.status(500).json({ message: error.message, location: 'likepost' });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if the user has already didnt like the post yet
      if (!post.likes.includes(decoded.userId)) {
        return res.status(400).json({ message: 'You have not liked this post yet' });
      }

      post.likes = post.likes.filter((like) => like.toString() !== decoded.userId.toString());
      await post.save();

      res.status(200).json({ message: 'Post unliked successfully', post });
    }
  } catch (error) {
    console.log('Error in unlikepost controller', error.message);
    res.status(500).json({ message: error.message, location: 'unlikepost' });
  }
};

export const siteStats = async (req, res) => {
  try {
    const currentDate = new Date();

    // Get total users
    const totalUsers = await User.countDocuments();
    const users15DaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 15));

    // Get users created in the last 15 days
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: users15DaysAgo },
    });
    const userCreationPercentage = totalUsers ? ((recentUsers / totalUsers) * 100).toFixed(2) : 0;

    // Get total posts
    const totalPosts = await Post.countDocuments();
    const posts15DaysAgo = new Date(new Date().setDate(new Date().getDate() - 15));

    // Get posts created in the last 15 days
    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: posts15DaysAgo },
    });
    const postCreationPercentage = totalPosts ? ((recentPosts / totalPosts) * 100).toFixed(2) : 0;

    // Get total admins
    const totalAdmins = await User.countDocuments({ idAdmin: true });

    // Get active users (users with posts or comments in the last 30 days)
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

    const activeUsers = await User.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'author',
          as: 'comments',
        },
      },
      {
        $project: {
          _id: 1,
          posts: {
            $filter: {
              input: '$posts',
              as: 'post',
              cond: { $gte: ['$$post.createdAt', thirtyDaysAgo] },
            },
          },
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $gte: ['$$comment.createdAt', thirtyDaysAgo] },
            },
          },
        },
      },
      {
        $match: {
          $or: [{ 'posts.0': { $exists: true } }, { 'comments.0': { $exists: true } }],
        },
      },
    ]);

    const activeUserCount = activeUsers.length;

    // Calculate inactive users count
    const inactiveUserCount = totalUsers - activeUserCount;

    // Calculate inactive users percentage based on total users
    const inactiveUsersPercentage =
      totalUsers > 0 ? ((inactiveUserCount / totalUsers) * 100).toFixed(2) : 0;

    res.status(200).json({
      message: 'Site stats retrieved successfully',
      stats: {
        totalUsers,
        usersCreatedIn15Days: recentUsers,
        userCreationPercentage,
        totalPosts,
        postsCreatedIn15Days: recentPosts,
        postCreationPercentage,
        totalAdmins,
        activeUsersCount: activeUserCount,
        inactiveUsers: inactiveUserCount,
        inactiveUsersPercentage,
      },
    });
  } catch (error) {
    console.log('Error in siteStats controller', error.message);
    res.status(500).json({ message: error.message, location: 'siteStats' });
  }
};
