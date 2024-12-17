import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userPic: {
      type: String,
      required: [true, "User image is required"],
      validate: {
        validator: function (value) {
          // Allow null, undefined, or an empty string to bypass the format check
          return !value || value === "null" || /\.(png|jpe?g)$/i.test(value);
        },
        message: "Only PNG and JPG images are allowed",
      },
      default:
        "https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg",
      // Max = 10MB
      // max: [10485760, "User image must be less than 10MB"],
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
