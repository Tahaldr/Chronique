import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";
import { usePostStore } from "./usePostStore";

export const useCommentStore = create((set) => ({
  loading: false,
  comments: [],

  createComment: async (postId, comment) => {
    try {
      set({ loading: true });
      const res = await axios.post(`/comment/createcomment/${postId}`, comment);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      showToast({
        message: error.response?.data.message || "Comment failed",
        type: "error",
      });
    }
  },

  getComments: async (postId, limit, page) => {
    // Fetch author data for each comment
    try {
      const res = await axios.get(
        `/comment/getcomments/${postId}?limit=${limit}&page=${page}`
      );
      const comments = res.data.comments;

      const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
          try {
            const author = await usePostStore
              .getState()
              .getAuthorPost(comment.author);
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

  likeComment: async (commentId) => {
    try {
      const res = await axios.post(`/comment/plusvote/${commentId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      showToast({
        message: error.response?.data.message || "Failed to upvote the comment",
        type: "error",
      });
      throw error;
    }
  },

  unlikeComment: async (commentId) => {
    try {
      const res = await axios.post(`/comment/minusvote/${commentId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      showToast({
        message:
          error.response?.data.message || "Failed to downvote the comment",
        type: "error",
      });
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const res = await axios.delete(`/comment/deletecomment/${commentId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      showToast({
        message: error.response?.data.message || "Failed to delete the comment",
        type: "error",
      });
      throw error;
    }
  },
}));
