import { create } from "zustand";
import axios from "../lib/axios";
import showToast from "../components/Toast";
import { useCommentStore } from "./useCommentStore";

export const usePostStore = create((set, get) => ({
  loading: false,

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

  // getComments: async (postId) => {
  //   // Fetch author data for each comment
  //   try {
  //     const res = await axios.get(`/comment/getcomments/${postId}`);
  //     const comments = res.data.comments;

  //     const commentsWithAuthors = await Promise.all(
  //       comments.map(async (comment) => {
  //         try {
  //           const author = await get().getAuthorPost(comment.author);
  //           return { ...comment, author };
  //         } catch (error) {
  //           console.log(error);
  //           return { ...comment, author: null };
  //         }
  //       })
  //     );

  //     return { ...res.data, comments: commentsWithAuthors };
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // },

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
            const comments = await useCommentStore
              .getState()
              .getComments(post._id);
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

  getTopWriters: async (limit = 3) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/post/topwriters?limit=${limit}`);
      set({ loading: false });
      return res.data;
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
            const comments = await useCommentStore
              .getState()
              .getComments(post._id);
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

  getRecentPosts: async (limit = 5) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/post/getrecentposts?limit=${limit}`);

      const posts = res.data.posts;

      const postsWithAuthorsComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await get().getAuthorPost(post.author);
            const comments = await useCommentStore
              .getState()
              .getComments(post._id);
            return { ...post, author, comments: comments.comments.length };
          } catch (error) {
            console.log(error);
            return { ...post, author: null, comments: 0 };
          }
        })
      );
      set({ loading: false });

      return {
        ...res.data,
        posts: postsWithAuthorsComments,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAuthorPosts: async (authorId, page = 1, limit = 10) => {
    try {
      const res = await axios.get(
        `/post/getauthorposts/${authorId}?page=${page}&limit=${limit}`
      );
      const posts = res.data.posts;

      // Fetch author data and comments length for each post
      const postsWithAuthorsComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await get().getAuthorPost(post.author);
            const comments = await useCommentStore
              .getState()
              .getComments(post._id);
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

  getRelatedAuthorPosts: async (postId, limit = 7) => {
    try {
      
      const res = await axios.get(
        `/post/getrelatedauthorposts/${postId}?limit=${limit}`
      );

      const posts = res.data.posts;

      // Fetch author data and comments length for each post
      const postsWithAuthorsComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await get().getAuthorPost(post.author);
            const comments = await useCommentStore
              .getState()
              .getComments(post._id);
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

  searchPosts: async (term, page = 1, limit = 10) => {
    if (!term) return;
    try {
      const res = await axios.get(
        `/post/searchposts?term=${term}&page=${page}&limit=${limit}`
      );
      const posts = res.data.posts;

      // Fetch author data and comments length for each post
      const postsWithAuthorsComments = await Promise.all(
        posts.map(async (post) => {
          try {
            const author = await get().getAuthorPost(post.author);
            const comments = await useCommentStore
              .getState()
              .getComments(post._id);
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

  getOnePost: async (postId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/post/getpost/${postId}`);
      const post = res.data.post;

      // Fetch author data and comments length
      try {
        const author = await get().getAuthorPost(post.author);
        const comments = await useCommentStore.getState().getComments(post._id);

        set({ loading: false });
        return {
          ...post,
          author,
          comments: comments.comments.length,
        };
      } catch (error) {
        console.log(error);
        return { ...post, author: null, comments: 0 };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deletePost: async (postId) => {
    try {
      const res = await axios.delete(`/post/deletepost/${postId}`);
      console.log(res.data);
      return res.data;
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
      showToast({
        message: error.response?.data?.message || "Failed to upvote the post",
        type: "error",
      });
      throw error;
    }
  },

  unlikePost: async (postId) => {
    try {
      const res = await axios.post(`/post/unlikepost/${postId}`);
      return res.data;
    } catch (error) {
      console.log(error);
      // if no refrech token so the message says to login
      showToast({
        message: error.response?.data?.message || "Failed to downvote the post",
        type: "error",
      });
      throw error;
    }
  },
}));
