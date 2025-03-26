import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["post", "comment"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [false, "Post is required"],
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: [false, "Comment is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      enum: [
        "inappropriate",
        "spam",
        "haram",
        "offensive",
        "harassment",
        "racism",
        "hate speech",
        "misinformation",
        "other",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description must be less than 500 characters"],
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
