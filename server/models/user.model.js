import mongoose from "mongoose";

const userSchema = new mongoose.schem();

const mongoose = require("mongoose");
const Schema = mongoose.schema({
  userPic: {
    type: String,
    default:
      "https://res.cloudinary.com/dv48ogvly/image/upload/v1730020149/Default_pfp_y29ox0.jpg",
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "Name already exists"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  idAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;