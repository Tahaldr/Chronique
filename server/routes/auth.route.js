import express from "express";
import {
  // upload,
  // checkFileSize,
  signup,
  login,
  logout,
  refreshToken,
  getallusers,
  getUser,
  deleteUser,
  deleteAllUsers,
  makeAdmin,
  getprofile,
} from "../controllers/auth.controller.js";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
// import multerUpload from "../middlewares/multer.middleware.js";

const router = express.Router();

// router.post("/upload", multerUpload.single("userPic"), upload);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshtoken", refreshToken);
router.get("/profile", protectedRoute, getprofile);
router.get("/getallusers", protectedRoute, adminRoute, getallusers);
router.get("/getuser/:id", protectedRoute, adminRoute, getUser);
router.post("/deleteuser/:id", protectedRoute, adminRoute, deleteUser);

// Delete all users - just for development purposes
router.delete("/deleteallusers", protectedRoute, adminRoute, deleteAllUsers);

// Give/remove admin rights
router.post("/makeadmin/:id", protectedRoute, adminRoute, makeAdmin);

export default router;
