import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";

export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  checkingAuth: true,

  upload: async (formData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ loading: false });
      console.log("File upload successful:", res.data);
      console.log("data");

      return res.data;
    } catch (error) {
      set({ loading: false });
      showToast({
        message: error.response?.data || "Upload failed",
        type: "error",
      });
    }
  },

  // Sign Up
  signup: async ({ userPic, name, email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/signup", {
        userPic,
        name,
        email,
        password,
      });
      const user = res.data.user;
      set({ user, loading: false });

      // Persist user in local storage
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      set({ loading: false });
      showToast({
        message: error.response?.data.message || "Signup failed",
        type: "error",
      });
    }
  },

  // Log In
  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      const user = res.data.user;
      set({ user, loading: false });

      // Persist user in local storage
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      set({ loading: false });
      showToast({
        message: error.response?.data.message || "Login failed",
        type: "error",
      });
    }
  },
}));
