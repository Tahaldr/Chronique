import express from 'express';
import {
  // upload,
  // checkFileSize,
  signup,
  login,
  logout,
  refreshToken,
  getAllUsers,
  getOnlyUsers,
  getOnlyAdmins,
  searchUsers,
  getUser,
  deleteUser,
  deleteAllUsers,
  makeAdmin,
  getprofile,
} from '../controllers/auth.controller.js';
import { protectedRoute, adminRoute } from '../middlewares/auth.middleware.js';
// import multerUpload from "../middlewares/multer.middleware.js";

const router = express.Router();

// router.post("/upload", multerUpload.single("userPic"), upload);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protectedRoute, logout);
router.post('/refreshtoken', refreshToken);
router.get('/profile', protectedRoute, getprofile);
router.get('/getallusers', protectedRoute, adminRoute, getAllUsers);
router.get('/getonlyusers', protectedRoute, adminRoute, getOnlyUsers);
router.get('/getonlyadmins', protectedRoute, adminRoute, getOnlyAdmins);
router.get('/searchusers', protectedRoute, adminRoute, searchUsers);
router.get('/getuser/:id', getUser);
router.delete('/deleteuser/:id', protectedRoute, adminRoute, deleteUser);

// Delete all users - just for development purposes
router.delete('/deleteallusers', protectedRoute, adminRoute, deleteAllUsers);

// Give/remove admin rights
router.post('/makeadmin/:id', protectedRoute, adminRoute, makeAdmin);

export default router;
