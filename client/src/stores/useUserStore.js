import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  // user: JSON.parse(localStorage.getItem("user")) || null,
  user: null,
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
      // const user = res.data.user;
      set({ user: res.data, loading: false });

      // Persist user in local storage
      // localStorage.setItem("user", JSON.stringify(user));
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
      // const user = res.data.user;
      set({ user: res.data, loading: false });

      // Persist user in local storage
      // localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      set({ loading: false });
      showToast({
        message: error.response?.data.message || "Login failed",
        type: "error",
      });
    }
  },

  // Log Out
  logout: async () => {
    try {
      await axios.post("auth/logout");
      set({ user: null });
    } catch (error) {
      console.log("Error in logout", error.response?.data?.message);
      toast.error("Logout failed");
    }
  },

  // Check Auth
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      console.log("Error in checkAuth", error.message);
      set({ user: null, checkingAuth: false });
    }
  },

  // Refresh Token
  refreshToken: async () => {
    // If already checking auth, don't run again
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refreshtoken");
      set({ checkingAuth: false });

      // for dev
      showToast({ message: "Refresh token successful", type: "success" });
      console.log("Refresh token successful:", res.data);
      return res.data;
    } catch (error) {
      showToast({ message: "Refresh token failed", type: "error" });
      console.log("Error in refreshToken", error.message);
      set({ user: null, checkingAuth: false });
    }
  },
}));

// // Axios interceptor for token refresh
// let refreshPromise = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // If a refresh is already in progress, wait for it to complete
//         if (refreshPromise) {
//           await refreshPromise;
//           return axios(originalRequest);
//         }

//         // Start a new refresh process
//         refreshPromise = useUserStore.getState().refreshToken();
//         await refreshPromise;
//         refreshPromise = null;

//         return axios(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login or handle as needed
//         useUserStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
