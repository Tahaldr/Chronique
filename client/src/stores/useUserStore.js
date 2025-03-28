import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";
import { getGlobalNavigate } from "../lib/navigation.js";

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
      // navigate("/");
      // window.location.href = "/"; // Forces navigation to home

      const navigate = getGlobalNavigate();
      if (navigate) navigate("/");
    } catch (error) {
      console.log("Error in logout", error?.response?.data?.message);
    }
  },

  // Check Auth
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("auth/profile");
      set({ user: res.data, checkingAuth: false });
      // return res.data;
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
      showToast({
        message: error?.response?.data?.message || "Refresh token failed",
        type: "error",
      });
      console.log(
        "Error in refreshToken",
        error?.response?.data || error.message
      );
      set({ user: null, checkingAuth: false });
    }
  },

  // Get All Users
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `/auth/getallusers?page=${page}&limit=${limit}`
      );
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log("Error in getAllUsers", error.message);
    }
  },

  // Get Only Users
  getOnlyUsers: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `/auth/getonlyusers?page=${page}&limit=${limit}`
      );
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log("Error in getOnlyUsers", error.message);
    }
  },

  // Get Only Admins
  getOnlyAdmins: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `/auth/getonlyadmins?page=${page}&limit=${limit}`
      );
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log("Error in getOnlyAdmins", error.message);
    }
  },

  // Search Users
  searchUsers: async (searchTerm, page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `/auth/searchusers?term=${searchTerm}&page=${page}&limit=${limit}`
      );
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log("Error in searchUsers", error.message);
    }
  },

  // Make Admin
  makeAdmin: async (userId) => {
    try {
      set({ loading: true });
      const res = await axios.post(`/auth/makeadmin/${userId}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log("Error in makeAdmin", error.message);
    }
  },

  // Delete User
  deleteUser: async (userId) => {
    try {
      set({ loading: true });
      const res = await axios.delete(`/auth/deleteuser/${userId}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log("Error in deleteUser", error.message);
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
