import redis from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
    // expiresIn: "5s",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
    // expiresIn: "5s",
  });

  return { accessToken, refreshToken };
};

const storedRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
    // 5 // 5 seconds
  ); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    // maxAge: 15 * 60 * 1000, // 15 minutes
    // maxAge: 1000 * 5, // 5 seconds
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // maxAge: 1000 * 5, // 5 seconds
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
      const imageSize = Buffer.byteLength(userPic, "base64");
      const ImageSizeMb = imageSize / 1024 / 1024;
      // console.log(ImageSizeMb, "Mbs");
      if (ImageSizeMb > 10) {
        return res.status(400).json({ message: "Max image size is 10mb" });
      }
    }

    if (!name) {
      return res.status(400).send({
        message: "Name is required",
      });
    }

    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        message: "Invalid email format",
      });
    }

    if (!password) {
      return res.status(400).send({
        message: "Password is required",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(userExists);
      return res.status(400).json({ message: "User already exists" });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Upload image to cloudinary
    let cloundinaryResponse = null;
    if (userPic) {
      cloundinaryResponse = await cloudinary.uploader.upload(userPic, {
        folder: "Chronique/users",
      });
    }

    const user = await User.create({
      userPic: cloundinaryResponse?.secure_url
        ? cloundinaryResponse.secure_url
        : "https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg",
      name,
      email,
      password,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storedRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "User created successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message, location: "signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Required fields validation
    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).send({
        message: "Password is required",
      });
    }

    // Check if user exists
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    // Direct password comparison
    if (userFound.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userFound._id);
    await storedRefreshToken(userFound._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: userFound,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message, location: "login" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del("refreshToken:" + decoded.userId);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: error.message, location: "logout" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res
      .status(200)
      .json({ message: "Refresh token successful", accessToken: accessToken });
  } catch (error) {
    console.log("Error in refresh controller", error.message);
    res.status(500).json({ message: error.message, location: "refresh" });
  }
};

export const getprofile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getprofile controller", error.message);
    res.status(500).json({ message: error.message, location: "getprofile" });
  }
};

export const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ message: users.length + " user(s) found successfully", users });
  } catch (error) {
    console.log("Error in getall controller", error.message);
    res.status(500).json({ message: error.message, location: "getall" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getuser controller", error.message);
    res.status(500).json({ message: error.message, location: "getuser" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteuser controller", error.message);
    res.status(500).json({ message: error.message, location: "deleteuser" });
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

    res
      .status(200)
      .json({ message: countUsers + " user(s) deleted successfully" });
  } catch (error) {
    console.log("Error in deleteallusers controller", error.message);
    res
      .status(500)
      .json({ message: error.message, location: "deleteallusers" });
  }
};

// Give/remove admin rights
export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // give/remove admin rights
    const user = await User.findById(id);
    user.idAdmin = !user.idAdmin;
    await user.save();
    res
      .status(200)
      .json({ message: "Changed User to admin : " + user.idAdmin });
  } catch (error) {
    console.log("Error in makeadmin controller", error.message);
    res.status(500).json({ message: error.message, location: "makeadmin" });
  }
};
