import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.schem

const mongoose = require("mongoose");
const Schema = mongoose.schema({
  userPic : {
    type : String,
    default : 'https://res.cloudinary.com/dv48ogvly/image/upload/v1730020149/Default_pfp_y29ox0.jpg',
    
  },
  name : {
    type : String,
    required : true,
    unique: true
  },
  email: {
    type : String,
    required : true,
    unique: true
  },
  password :{
    type : String,
    required : true
  },
  idAdmin: {
    type : Boolean,
    default : false
  }
})