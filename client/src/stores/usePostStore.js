import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";

export const usePostStore = create((set, get) => ({
  // posts: { posts: [], hasMore: true }, // hasMore to track if more pages exist
  // loading: false,

  getPopularPosts: async (page = 1, limit = 10) => {
    try {
      const res = await axios.get(
        `/post/getallposts?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error) {
      showToast({
        message: error.response?.data.message || "Failed to get popular posts",
        type: "error",
      });
      throw error; // Let React Query handle the error
    }
  },

  getCategoryPosts: async (category, page = 1, limit = 1) => {
    try {
      const res = await axios.get(
        `/post/getcategoryposts/${category}?page=${page}&limit=${limit}`
      );
      return res.data; // Directly return the response
    } catch (error) {
      showToast({
        message:
          error.response?.data.message ||
          `Failed to get ${category} category posts`,
        type: "error",
      });
      throw error;
    }
  },
}));
