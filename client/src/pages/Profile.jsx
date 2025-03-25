import { Link, useParams } from "react-router-dom";
import Transition from "../components/Transition";
import { motion } from "framer-motion";
import BackBtn from "../components/Elements/BackBtn";
import { useUserStore } from "../stores/useUserStore";
import { usePostStore } from "../stores/usePostStore";
import { MdOutlineAdd, MdOutlineLogout, MdShield } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import formatNumber from "../lib/formatNumber";
import ArrowScrollUp from "../components/Elements/ArrowScrollUp";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmWindow from "../components/Elements/ConfirmWindow";
import Post from "../components/HomeComponents/ChronicleComps/Post";
import { PostContext } from "../App";
import Loading from "../components/Loading";
import { useInView } from "react-intersection-observer";
import showToast from "../components/Toast";
import Tooltip from "../components/Elements/Tooltip";

const Profile = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const { logout, user } = useUserStore();
  const { getAuthorPost, deletePost } = usePostStore();

  const { getAuthorPosts, likePost, unlikePost } = usePostStore();

  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  // Post Context
  const { deleteConfirm, setDeleteConfirm } = useContext(PostContext);

  // Fetch author data
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await getAuthorPost(id);
        // console.log("profile data", data);
        setAuthor(data);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };
    if (id) {
      fetchAuthor();
    }
  }, [id, getAuthorPost]);
  // console.log("author", author);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts", id],
    queryFn: ({ pageParam = 1 }) => getAuthorPosts(id, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return null;
    },
  });
  // console.log("data", data);

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  // Update the cached data after liking a post
  const handleLikePost = async (postId) => {
    try {
      await likePost(postId); // Perform the API call to like the post
      queryClient.setQueryData(["posts", id], (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? { ...post, likes: [...post.likes, user?._id] }
                : post
            ),
          })),
        };
        return newData;
      });
    } catch (error) {
      console.log(error);
      showToast({ message: "Failed to like the post.", type: "error" });
    }
  };

  // Update the cached data after unliking a post
  const handleUnlikePost = async (postId) => {
    try {
      await unlikePost(postId); // Perform the API call to unlike the post
      queryClient.setQueryData(["posts", id], (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    likes: post.likes.filter((like) => like !== user?._id),
                  }
                : post
            ),
          })),
        };
        return newData;
      });
    } catch (error) {
      console.log(error);
      showToast({ message: "Failed to unlike the post.", type: "error" });
    }
  };

  // Update the cached data after deleting a post
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId); // API call to delete the post

      queryClient.setQueryData(["posts", id], (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post._id !== postId),
          })),
        };
        return newData;
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-darker">
        <Loading size="7xl" color="light" />
      </div>
    );
  // if error showToast :
  if (isError) {
    showToast({ message: error.message, type: "error" });
  }

  return (
    <>
      <ArrowScrollUp type="fixed" />

      {deleteConfirm.postId && deleteConfirm.confirming && (
        <ConfirmWindow
          confirming={setDeleteConfirm}
          handleFunc={() => handleDeletePost(deleteConfirm.postId)}
          type="post"
        />
      )}
      <div className="bg-darker w-full flex items-center justify-center">
        {/* Back to Home button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 z-40"
        >
          <BackBtn />
        </motion.div>
        {/* Profile */}
        <motion.div
          className="w-full flex flex-col justify-center items-center gap-0 mt-8 md:mt-auto"
          initial={{ y: window.innerHeight + 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Paper cut top */}
          <img
            className="w-full"
            src="/OtherImg/PaperCutPageTop.png"
            alt="paper"
          />
          <div
            className="w-full md:mt-[-2Opx] lg:mt-[-45px]
          bg-[url(/OtherImg/NewsPaper_texture.png)] bg-center"
          >
            {/* Profile content */}
            <div>
              {/* User Info */}
              <div className="flex flex-col justify-center items-center">
                <img
                  src={author?.userPic}
                  alt="User pfp"
                  className="rounded-full object-cover aspect-[1/1] w-1/4 md:w-1/5 lg:w-[14%] mb-4"
                />
                <div className="font-mediumPrimary text-darkest text-2xl flex justify-center items-center gap-2">
                  <p>{author?.name || "Unknown"} </p>
                  {/* Admin badge */}
                  {author?.idAdmin && (
                    <span className="relative">
                      <Tooltip text="admin">
                        <MdShield className="text-lg md:text-xl hover:text-dark hover:scale-110" />
                      </Tooltip>
                    </span>
                  )}
                </div>
                <p className="font-smallMedium text-dark mb-4">
                  {formatNumber(author?.totalLikes) || "0"} votes
                </p>
                {user && user._id === id && (
                  <div className="flex gap-3">
                    {/* Create post btn */}
                    <Tooltip text="create post">
                      <Link
                        to="/create/new"
                        className="flex size-8 justify-center items-center font-bigPrimary border border-darkish-50 hover:border-darkest
                       text-dark bg-lightish hover:bg-light hover:text-darkest tracking-wide text-base md:text-lg"
                      >
                        <span>
                          <MdOutlineAdd className="" />
                        </span>
                        {/* <p>CREATE POST</p> */}
                      </Link>
                    </Tooltip>

                    {/* Logout btn */}
                    <Tooltip text="logout">
                      <button
                        onClick={() => logout()}
                        className="flex size-8 justify-center items-center font-bigPrimary border border-darkish-50 hover:border-none
                       text-dark bg-lightish hover:bg-red-800 hover:text-lightest tracking-wide text-xs md:text-sm"
                      >
                        <span>
                          <MdOutlineLogout className="" />
                        </span>
                        {/* <p>LOGOUT</p> */}
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
              {/* User Posts */}
              <div className="mt-14 mx-5 md:mx-10">
                {/* Posts title */}
                <div className="flex justify-center items-center py-4 border-y border-light">
                  <p className="font-bigPrimary text-2xl text-darker">
                    {id === user?._id ? "Your Posts" : `User Posts`}
                  </p>
                </div>
                {/* Posts */}
                <div className="h-screen w-full relative">
                  {data?.pages && data?.pages[0]?.posts.length > 0 ? (
                    <div>
                      {data?.pages.map((group, i) => (
                        <div key={i}>
                          {group.posts.map((post, index) => (
                            <div
                              key={post._id}
                              className="py-2 px-5 flex flex-col gap-5"
                            >
                              {/* Post Component */}
                              <Post
                                type="profile"
                                page="profile"
                                post={post}
                                user={user}
                                index={index}
                                i={i}
                                handleLikePost={handleLikePost}
                                handleUnlikePost={handleUnlikePost}
                              />
                              <hr className="border-light" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // CHANGE LATER
                    <div className="h-screen flex justify-center py-12">
                      <p className="font-smallMedium text-lg text-darker">
                        No posts yet
                      </p>
                    </div>
                  )}

                  {isFetching && isFetchingNextPage && (
                    <div className="flex items-center justify-center h-10">
                      <Loading size="3xl" color="dark" />
                    </div>
                  )}

                  <div ref={ref} className="h-20"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const ProfilePage = (props) => <Transition OgComponent={Profile} {...props} />;
export default ProfilePage;

// export default Profile;
