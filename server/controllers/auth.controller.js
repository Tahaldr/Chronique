import redis from '../lib/redis.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
// import Report from "../models/report.model.js";
import jwt from 'jsonwebtoken';
import cloudinary from '../lib/cloudinary.js';
import mongoose from 'mongoose';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    // expiresIn: "30s",
    expiresIn: '1d',
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
    // expiresIn: '30s',
    // expiresIn: "5s",
  });

  return { accessToken, refreshToken };
};

const storedRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    'EX',
    7 * 24 * 60 * 60 // 7 days
    // 5 // 5 seconds
    // 30 // 30 seconds
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
    maxAge: 24 * 60 * 60 * 1000, // 1d
    // maxAge: 15 * 60 * 1000, // 15 minutes
    // maxAge: 30 * 1000, // 30s
    // maxAge: 1000 * 5, // 5 seconds
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // maxAge: 1000 * 5, // 5 seconds
    // maxAge: 1000 * 30, // 30 seconds
  });
};

// export const upload = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   // Send the file path to Cloudinary or respond with the file details
//   res.json({ path: req.file.path, ...req.file });
// };

export const signup = async (req, res) => {
  const { userPic, name, email, password } = req.body;
  try {
    // Required fields validation
    if (userPic) {
      const imageSize = Buffer.byteLength(userPic, 'base64');
      const ImageSizeMb = imageSize / 1024 / 1024;
      // console.log(ImageSizeMb, "Mbs");
      if (ImageSizeMb > 10) {
        return res.status(400).json({ message: 'Max image size is 10mb' });
      }
    }

    if (!name) {
      return res.status(400).send({
        message: 'Name is required',
      });
    }

    if (!email) {
      return res.status(400).send({
        message: 'Email is required',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: 'Invalid email format',
      });
    }

    if (!password) {
      return res.status(400).send({
        message: 'Password is required',
      });
    }

    // Check if password has been used before
    const passwordUsedBefore = await User.findOne({ password });
    if (passwordUsedBefore) {
      return res.status(400).json({
        message: 'Password has been used before. Please choose a new one',
      });
    }

    // Password validation
    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long',
      });
    }

    // Check if password starts with a capital letter
    if (!/^[A-Z]/.test(password)) {
      return res.status(400).json({
        message: 'Password must start with a capital letter',
      });
    }

    // Check if password starts with a number or symbol
    if (/^[0-9!@#$%^&*()_+={}|[\]\\:;'"<>,.?/-]/.test(password)) {
      return res.status(400).json({
        message: 'Password cannot start with a number or symbol',
      });
    }

    // Check for a combination of characters, symbols, and numbers
    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}|[\]\\:;'"<>,.?/-])/.test(password)
    ) {
      return res.status(400).json({
        message: 'Password must contain a mix of uppercase, lowercase, numbers, and symbols',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(userExists);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Upload image to cloudinary
    let cloundinaryResponse = null;
    if (userPic) {
      cloundinaryResponse = await cloudinary.uploader.upload(userPic, {
        folder: 'Chronique/users',
      });
    }

    const user = await User.create({
      userPic: cloundinaryResponse?.secure_url
        ? cloundinaryResponse.secure_url
        : 'https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg',
      name,
      email,
      password,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storedRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: 'User created successfully',
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ message: error.message, location: 'signup' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Required fields validation
    if (!email) {
      return res.status(400).send({
        message: 'Email is required',
      });
    }

    if (!password) {
      return res.status(400).send({
        message: 'Password is required',
      });
    }

    // Check if user exists
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Direct password comparison
    if (userFound.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userFound._id);
    await storedRefreshToken(userFound._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      user: userFound,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ message: error.message, location: 'login' });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del('refreshToken:' + decoded.userId);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: error.message, location: 'logout' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      // { expiresIn: "15m" }
      { expiresIn: '1d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // maxAge: 15 * 60 * 1000, // 15 minutes
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: 'Refresh token successful', accessToken: accessToken });
  } catch (error) {
    console.log('Error in refresh controller', error.message);
    res.status(500).json({ message: error.message, location: 'refresh' });
  }
};

export const getprofile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log('Error in getprofile controller', error.message);
    res.status(500).json({ message: error.message, location: 'getprofile' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    // Count total users
    const totalUsers = await User.countDocuments();
    const totalPages = limit ? Math.ceil(totalUsers / limit) : 1;

    // Fetch users with pagination
    const usersQuery = User.find().sort({ createdAt: -1 }); // Sort by newest

    if (page && limit) {
      usersQuery.skip(skip).limit(limit);
    }

    let users = await usersQuery;

    // Calculate votes and post count
    users = await Promise.all(
      users.map(async (user) => {
        const posts = await Post.find({ author: user._id }, 'likes');
        const votes = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);
        const postCount = posts.length; // Count the posts created by the user
        return { ...user.toObject(), votes, postCount }; // Add postCount to the user object
      })
    );

    // Check if there are more pages
    const hasMore = page && limit ? page * limit < totalUsers : false;

    res.status(200).json({
      message: `${users.length} user(s) found successfully`,
      users,
      totalUsers,
      totalPages,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    });
  } catch (error) {
    console.log('Error in getAllUsers controller', error.message);
    res.status(500).json({ message: error.message, location: 'getAllUsers' });
  }
};

export const getOnlyUsers = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    // Count total non-admin users
    const totalUsers = await User.countDocuments({ idAdmin: false });
    const totalPages = limit ? Math.ceil(totalUsers / limit) : 1;

    // Fetch non-admin users with pagination
    const usersQuery = User.find({ idAdmin: false }).sort({ createdAt: -1 });

    if (page && limit) {
      usersQuery.skip(skip).limit(limit);
    }

    let users = await usersQuery;

    // Calculate votes (sum of likes array length from all user posts)
    users = await Promise.all(
      users.map(async (user) => {
        const posts = await Post.find({ author: user._id }, 'likes');
        const votes = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);
        const postCount = posts.length; // Count the posts created by the user
        return { ...user.toObject(), votes, postCount };
      })
    );

    // Check if there are more pages
    const hasMore = page && limit ? page * limit < totalUsers : false;

    res.status(200).json({
      message: `${users.length} user(s) found successfully`,
      users,
      totalUsers,
      totalPages,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    });
  } catch (error) {
    console.log('Error in getOnlyUsers controller', error.message);
    res.status(500).json({ message: error.message, location: 'getOnlyUsers' });
  }
};

export const getOnlyAdmins = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    // Count total admin users
    const totalUsers = await User.countDocuments({ idAdmin: true });
    const totalPages = limit ? Math.ceil(totalUsers / limit) : 1;

    // Fetch admin users with pagination
    const usersQuery = User.find({ idAdmin: true }).sort({ createdAt: -1 });

    if (page && limit) {
      usersQuery.skip(skip).limit(limit);
    }

    let users = await usersQuery;

    // Calculate votes (sum of likes array length from all admin user posts)
    users = await Promise.all(
      users.map(async (user) => {
        const posts = await Post.find({ author: user._id }, 'likes');
        const votes = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);
        const postCount = posts.length; // Count the posts created by the user
        return { ...user.toObject(), votes, postCount };
      })
    );

    // Check if there are more pages
    const hasMore = page && limit ? page * limit < totalUsers : false;

    res.status(200).json({
      message: `${users.length} admin(s) found successfully`,
      users,
      totalUsers,
      totalPages,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    });
  } catch (error) {
    console.log('Error in getOnlyAdmins controller', error.message);
    res.status(500).json({ message: error.message, location: 'getOnlyAdmins' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const term = req.query.term || '';
    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const skip = page && limit ? (page - 1) * limit : 0;

    const matchStage = term
      ? {
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { email: { $regex: term, $options: 'i' } },
            {
              _id: mongoose.Types.ObjectId.isValid(term) ? mongoose.Types.ObjectId(term) : null,
            },
          ],
        }
      : {};

    const totalUsers = await User.countDocuments(matchStage);
    const totalPages = limit ? Math.ceil(totalUsers / limit) : 1;

    const usersQuery = User.find(matchStage).sort({ createdAt: -1 });

    if (page && limit) {
      usersQuery.skip(skip).limit(limit);
    }

    let users = await usersQuery;
    users = await Promise.all(
      users.map(async (user) => {
        const posts = await Post.find({ author: user._id }, 'likes');
        const votes = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);
        const postCount = posts.length; // Count the posts created by the user
        return { ...user.toObject(), votes, postCount };
      })
    );

    const hasMore = page && limit ? page * limit < totalUsers : false;

    res.status(200).json({
      message: `${users.length} user(s) found successfully`,
      users,
      totalUsers,
      totalPages,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    });
  } catch (error) {
    console.error('Error in searchUsers controller:', error.message);
    res.status(500).json({ message: error.message, location: 'searchUsers' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user and calculate totalLikes using aggregation
    const userWithLikes = await User.aggregate([
      // Match the user by their ID
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      // Lookup posts to calculate total likes
      {
        $lookup: {
          from: 'posts', // Replace with your actual posts collection name
          localField: '_id', // User's _id
          foreignField: 'author', // Post's author field
          as: 'userPosts',
        },
      },
      // Add a field to calculate total likes
      {
        $addFields: {
          totalLikes: {
            $sum: {
              $map: {
                input: '$userPosts',
                as: 'post',
                in: { $size: '$$post.likes' },
              },
            },
          },
        },
      },
      // Optionally clean up the result
      {
        $project: {
          userPosts: 0, // Remove posts from the response
        },
      },
    ]);

    if (userWithLikes.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: userWithLikes[0] });
  } catch (error) {
    console.error('Error in getUser controller:', error.message);
    res.status(500).json({ message: error.message, location: 'getUser' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = '67e1e4243797128f37393189';

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

    // Prevent self-deletion and deleting the server owner
    if (id === userId) {
      return res.status(403).json({ message: 'You cannot delete your own account' });
    }
    if (id === ownerId) {
      return res.status(403).json({ message: 'You cannot delete the server owner' });
    }

    // Find the user to ensure they exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cascade delete related posts, comments, and reports
    // Delete posts where the user is the author
    await Post.deleteMany({ author: id });

    // Delete comments where the user is the author
    await Comment.deleteMany({ author: id });

    // Delete reports where the user is the reporter
    // await Report.deleteMany({ reporter: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.log('Error in deleteUser controller', error.message);
    res.status(500).json({ message: error.message, location: 'deleteUser' });
  }
};

// just for developpement
export const deleteAllUsers = async (req, res) => {
  try {
    // Delete all users except admins
    const users = await User.find();

    let countUsers = 0;
    for (const user of users) {
      if (!user.idAdmin) {
        countUsers++;
        await User.findByIdAndDelete(user._id);
      }
    }

    res.status(200).json({ message: countUsers + ' user(s) deleted successfully' });
  } catch (error) {
    console.log('Error in deleteallusers controller', error.message);
    res.status(500).json({ message: error.message, location: 'deleteallusers' });
  }
};

// Promote/demote user to Admin
export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const ownerId = '67e1e4243797128f37393189';

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

    // Prevent self-promotion/demotion and modifying the server owner
    if (id === userId) {
      return res.status(403).json({ message: 'You cannot change your own admin status' });
    }
    if (id === ownerId) {
      return res.status(403).json({ message: "You cannot change the server owner's admin status" });
    }

    // Find user and toggle admin status
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.idAdmin = !user.idAdmin;
    await user.save();

    res.status(200).json({ message: `User admin status changed: ${user.idAdmin}`, user });
  } catch (error) {
    console.log('Error in makeAdmin controller', error.message);
    res.status(500).json({ message: error.message, location: 'makeAdmin' });
  }
};
