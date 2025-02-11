import { useContext, useEffect, useState } from "react";
import { usePostStore } from "../stores/usePostStore";
import { useNavigate, useParams } from "react-router-dom";
import BackBtn from "../components/Elements/BackBtn";
import ProfileImg from "../components/Elements/ProfileImg";
import Post from "../components/HomeComponents/ChronicleComps/Post";
import { useUserStore } from "../stores/useUserStore";
import Loading from "../components/Loading";
import Transition from "../components/Transition";
import { Toaster } from "react-hot-toast";
import ConfirmWindow from "../components/Elements/ConfirmWindow";
import { PostContext } from "../App";
import showToast from "../components/Toast";
import ArrowScrollUp from "../components/Elements/ArrowScrollUp";

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const { loading, getOnePost, likePost, unlikePost, deletePost } =
    usePostStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { deleteConfirm, setDeleteConfirm } = useContext(PostContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getOnePost(postId);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    if (postId) {
      fetchPost();
    }
  }, [postId, getOnePost]);
  // console.log("post", post);

  // Function to handle liking a post
  const handleLikePost = async (postId) => {
    if (!post) return;
    try {
      await likePost(postId);
      setPost((prevPost) => ({
        ...prevPost,
        likes: [...prevPost.likes, user?._id], // Add user ID to likes
      }));
    } catch (error) {
      console.log(error);
      showToast({
        message: "Failed to upvote the post",
        type: "error",
      });
    }
  };

  // Function to handle unliking a post
  const handleUnlikePost = async (postId) => {
    if (!post) return;
    try {
      await unlikePost(postId);
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes.filter((like) => like !== user?._id), // Remove user ID from likes
      }));
    } catch (error) {
      console.log(error);
      showToast({
        message: "Failed to downvote the post",
        type: "error",
      });
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      navigate("/");
    } catch (error) {
      console.log(error);
      showToast({
        message: "Failed to delete the post",
        type: "error",
      });
    }
  };

  return (
    <>
      <ArrowScrollUp type="fixed" />
      <Toaster />
      {deleteConfirm.postId && deleteConfirm.confirming && (
        <ConfirmWindow
          confirming={setDeleteConfirm}
          handleFunc={() => handleDeletePost(deleteConfirm.postId)}
        />
      )}
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          {/* Back button & profile dropdown */}
          <div className="relative w-full bg-red-300">
            {/* Back button */}
            <div className="fixed z-40">
              <BackBtn />
            </div>

            {/* Profile dropdown */}
            {user && (
              <div className="absolute top-5 right-5">
                <ProfileImg type="postdetails" />
              </div>
            )}
          </div>
          <div className="py-20 px-5 lg:py-5 lg:px-0 w-full lg:w-1/2 flex flex-col gap-20">
            {/* Post */}
            <div className="w-full">
              {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                  <Loading color="dark" size="7xl" />
                </div>
              ) : post ? (
                <Post
                  type="details"
                  page="details"
                  post={post}
                  user={user}
                  handleLikePost={handleLikePost}
                  handleUnlikePost={handleUnlikePost}
                />
              ) : (
                !loading && (
                  <div className="w-full flex items-center justify-center">
                    <p className="text-lg font-small text-darker">
                      No post found
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Comments & comment form */}
            <div className="w-full h-screen bg-red-200"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const PostDetailsTransition = (props) => (
  <Transition OgComponent={PostDetails} {...props} />
);

export default PostDetailsTransition;

// export default PostDetails;
