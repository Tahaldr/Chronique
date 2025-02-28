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
import PostComments from "../components/PostComp/PostComments";
import AuthorOtherPosts from "../components/PostComp/AuthorOtherPosts";
import { TbHandMove } from "react-icons/tb";
import { motion } from "framer-motion";

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { postId } = useParams();
  const {
    loading,
    getOnePost,
    getRelatedAuthorPosts,
    likePost,
    unlikePost,
    deletePost,
  } = usePostStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { deleteConfirm, setDeleteConfirm } = useContext(PostContext);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const data = await getRelatedAuthorPosts(postId);
        setRelatedPosts(data.posts);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };
    if (postId) {
      fetchRelatedPosts();
    }
  }, [getRelatedAuthorPosts, postId]);
  // console.log("relatedPosts", relatedPosts);

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

          {/* Post & comments */}
          <motion.div
            className="py-20 px-5 lg:py-5 lg:px-0 w-full lg:w-1/2 flex flex-col gap-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
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
            <div className="w-full flex flex-col gap-5">
              <PostComments PostId={postId} type="mini" />
            </div>

            {/* Author Other Posts */}
            <hr className="border-light -mb-10" />
            <div className="w-full flex flex-col gap-8 mb-10">
              <h4 className="font-smallSemiBold text-darker">
                You may also like
              </h4>
              {loading ? (
                <div className="w-full h-20 flex items-center justify-center">
                  <Loading color="dark" size="3xl" />
                </div>
              ) : (
                <>
                  <AuthorOtherPosts posts={relatedPosts} />
                  {/* Note for dragging */}
                  <div className="w-full h-12 justify-center text-sm font-smallSemiBoldItalic text-darkish flex items-center gap-1">
                    <TbHandMove />
                    <span>Drag to scroll</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
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
