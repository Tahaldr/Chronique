import { usePostStore } from "../stores/usePostStore";
import showToast from "../components/Toast";

// Update the cached data after liking a post
export const handleLikePost = async (postId, queryClient, keys = []) => {
  try {
    const { likePost, user } = usePostStore.getState(); // Destructure state functions and user
    await likePost(postId); // Perform the API call to like the post

    queryClient.setQueryData(["posts", ...keys], (oldData) => {
      if (!oldData) return null; // No need to return oldData if it's null

      const newData = {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: [...post.likes, user?._id], // Add the user ID to likes
                }
              : post
          ),
        })),
      };

      return newData;
    });
  } catch (error) {
    console.error(`Failed to like the post with ID: ${postId}`, error);
    showToast({ message: "Failed to like the post.", type: "error" });
  }
};

// Update the cached data after unliking a post
export const handleUnlikePost = async (postId, queryClient, keys = []) => {
  try {
    const { unlikePost, user } = usePostStore.getState(); // Destructure state functions and user
    await unlikePost(postId); // Perform the API call to unlike the post

    queryClient.setQueryData(["posts", ...keys], (oldData) => {
      if (!oldData) return null; // No need to return oldData if it's null

      const newData = {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.filter((like) => like !== user?._id), // Remove the user ID from likes
                }
              : post
          ),
        })),
      };

      return newData;
    });
  } catch (error) {
    console.error(`Failed to unlike the post with ID: ${postId}`, error);
    showToast({ message: "Failed to unlike the post.", type: "error" });
  }
};
