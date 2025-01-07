import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";

export const usePostStore = create((set, get) => ({
  getAuthorPost: async (authorId) => {
    try {
      const res = await axios.get(`/auth/getuser/${authorId}`);
      return res.data.user;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch author's posts"
      );
    }
  },

  getComments: async (postId) => {
    // Fetch author data for each comment
    try {
      const res = await axios.get(`/comment/getcomments/${postId}`);
      const comments = res.data.comments;

      const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
          try {
            const author = await get().getAuthorPost(comment.author);
            return { ...comment, author };
          } catch (error) {
            console.log(error);
            return { ...comment, author: null };
          }
        })
      );

      return { ...res.data, comments: commentsWithAuthors };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getPopularPosts: async (page = 1, limit = 10) => {
    try {
      const res = await axios.get(
        `/post/getallposts?page=${page}&limit=${limit}`
      );
      const posts = res.data.posts;

      // Fetch author data and comments length for each post
      const postsWithAuthorsComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await get().getAuthorPost(post.author);
            const comments = await get().getComments(post._id);
            return { ...post, author, comments: comments.comments.length };
          } catch (error) {
            console.log(error);
            return { ...post, author: null, comments: 0 };
          }
        })
      );

      return {
        ...res.data,
        posts: postsWithAuthorsComments,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getCategoryPosts: async (category, page = 1, limit = 10) => {
    try {
      const res = await axios.get(
        `/post/getcategoryposts/${category}?page=${page}&limit=${limit}`
      );
      const posts = res.data.posts;

      // Fetch author data and comments length for each post
      const postsWithAuthorsComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await get().getAuthorPost(post.author);
            const comments = await get().getComments(post._id);
            return { ...post, author, comments: comments.comments.length };
          } catch (error) {
            console.log(error);
            return { ...post, author: null, comments: 0 };
          }
        })
      );

      return {
        ...res.data,
        posts: postsWithAuthorsComments,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const res = await axios.post(`/post/likepost/${postId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  unlikePost: async (postId) => {
    try {
      const res = await axios.post(`/post/unlikepost/${postId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
