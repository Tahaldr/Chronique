import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    postPic: {
      type: String,
      required: false, // Image is optional
      validate: {
        validator: function (value) {
          // Allow null, undefined, or an empty string to bypass the format check
          return !value || value === 'null' || /\.(png|jpe?g)$/i.test(value);
        },
        message: 'Only PNG and JPG images are allowed',
      },
      default: null, // Ensure the default is null if no image is provided
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: [true, 'Title already exists'],
      maxlength: [130, 'Title must be less than 130 characters'],
    },
    author: {
      // reference to user model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [10000, 'Content must be less than 10000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
