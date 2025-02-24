import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePostStore } from "../../stores/usePostStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Loading from "../../components/Loading";
import showToast from "../../components/Toast";
import RecentPost from "../../components/HomeComponents/ChronicleComps/RecentPost";
import { MdOutlinePostAdd } from "react-icons/md";
import { useUserStore } from "../../stores/useUserStore";
import { Toaster } from "react-hot-toast";
import TopWriter from "../../components/HomeComponents/ChronicleComps/TopWriter";
import ConfirmWindow from "../../components/Elements/ConfirmWindow";
import Post from "../../components/HomeComponents/ChronicleComps/Post";
import ArrowScrollUp from "../../components/Elements/ArrowScrollUp";
import { PostContext } from "../../App";

const TheChronicle = ({
  activeCategory,
  searchFinalTerm,
  // setActiveCategory,
  // searchTerm,
  // setSearchFinalTerm,
  // setSearchTerm,
}) => {
  const sidebarRef = useRef(null);
  const [sidebarTop, setSidebarTop] = useState(null);
  // const [arrowUpShow, setArrowUpShow] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [topWriters, setTopWriters] = useState([]);

  const { ref, inView } = useInView();

  const { setDeleteConfirm, deleteConfirm, searchSubmitted } =
    useContext(PostContext);

  // Stores
  const {
    loading,
    getPopularPosts,
    getTopWriters,
    getCategoryPosts,
    getRecentPosts,
    searchPosts,
    deletePost,
    likePost,
    unlikePost,
  } = usePostStore();
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  // console.log("getComments", getComments("676a8e5b970b6b88d66e77aa"));
  // console.log("getPopularPosts", getPopularPosts());
  // console.log("getCategoryPosts", getCategoryPosts("Technology"));
  // console.log("getRecentPosts", getRecentPosts());
  // console.log("getTopWriters", getTopWriters());

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await getRecentPosts(3);
        setRecentPosts(res.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentPosts();
  }, [getRecentPosts]);

  // Fetch top writers
  useEffect(() => {
    const fetchTopWriters = async () => {
      try {
        const res = await getTopWriters();
        setTopWriters(res.topWriters);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTopWriters();
  }, [getTopWriters]);

  // Manage sidebar position
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        setSidebarTop(sidebarRef.current.getBoundingClientRect().top);
      }
    };
    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, [sidebarRef]);

  // Fetch posts data & search posts using infinite query
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
    queryKey: ["posts", activeCategory, searchFinalTerm],
    queryFn: ({ pageParam = 1 }) => {
      if (searchSubmitted && searchFinalTerm) {
        if (pageParam === 1) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return searchPosts(searchFinalTerm, pageParam);
      } else if (activeCategory === "Popular") {
        return getPopularPosts(pageParam);
      } else {
        return getCategoryPosts(activeCategory, pageParam);
      }
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return null;
    },
  });
  console.log("data", data);

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
      queryClient.setQueryData(
        ["posts", activeCategory, searchFinalTerm],
        (oldData) => {
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
        }
      );
    } catch (error) {
      console.log(error);
      showToast({ message: "Failed to like the post.", type: "error" });
    }
  };

  // Update the cached data after unliking a post
  const handleUnlikePost = async (postId) => {
    try {
      await unlikePost(postId); // Perform the API call to unlike the post
      queryClient.setQueryData(
        ["posts", activeCategory, searchFinalTerm],
        (oldData) => {
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
        }
      );
    } catch (error) {
      console.log(error);
      showToast({ message: "Failed to unlike the post.", type: "error" });
    }
  };

  // Update the cached data after deleting a post
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId); // API call to delete the post

      queryClient.setQueryData(
        ["posts", activeCategory, searchFinalTerm],
        (oldData) => {
          if (!oldData) return oldData;

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post._id !== postId),
            })),
          };
          return newData;
        }
      );
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading size="3xl" color="dark" />
      </div>
    );

  if (isError) {
    showToast({ message: error.message, type: "error" });
  }

  return (
    <>
      <Toaster />
      {deleteConfirm.postId && deleteConfirm.confirming && (
        <ConfirmWindow
          confirming={setDeleteConfirm}
          handleFunc={() => handleDeletePost(deleteConfirm.postId)}
        />
      )}
      <div className="flex">
        {/* Main Posts */}
        <div className="h-full md:w-2/3 relative">
          <ArrowScrollUp type="sticky" />

          {searchSubmitted &&
            data &&
            data.pages &&
            data.pages[0] &&
            data.pages[0].posts && (
              <h1 className="text-base font-smallMedium text-darker w-full px-6 py-4">
                {data.pages[0].posts.length > 0
                  ? `Search Results for "${searchFinalTerm}"`
                  : `No results found for "${searchFinalTerm}"`}
              </h1>
            )}

          {data?.pages ? (
            <div>
              {data?.pages.map((group, i) => (
                <div key={i}>
                  {group.posts.map((post, index) => (
                    <div
                      key={post._id}
                      className={`
                        ${
                          searchSubmitted && searchFinalTerm
                            ? "w-screen md:w-auto"
                            : ""
                        }
                        py-2 px-5 flex flex-col gap-5`}
                    >
                      {/* Post Component */}
                      <Post
                        type="home"
                        page="home"
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
            <div className="w-screen md:w-full h-full flex flex-col items-center justify-center p-28 font-mediumPrimary text-lg leading-6">
              <p className="text-dark">No posts yet ...</p>
              <p className="text-darkest flex items-center gap-1">
                be the first to write
                <MdOutlinePostAdd className="text-darkest" />
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

        {/* Sidebar */}
        <div
          className="h-screen w-1/3 hidden md:block"
          id="sidebar"
          ref={sidebarRef}
        >
          <motion.div
            className="w-full h-full border-l border-light p-3 lg:p-5 flex flex-col gap-7"
            style={
              sidebarTop <= 0 && sidebarTop != null && sidebarTop != undefined
                ? { position: "fixed", top: 0, width: "33.333333%" }
                : {}
            }
          >
            {/* Recent Posts */}
            <div className="flex flex-col w-full gap-3 h-3/5">
              <p className="text-darkest font-mediumPrimary border-b border-light pb-2">
                Latest Headlines
              </p>
              <div className="flex flex-col justify-start gap-2 lg:gap-4 h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loading size="3xl" color="dark" />
                  </div>
                ) : (
                  recentPosts.map((post) => (
                    <RecentPost key={post._id} post={post} />
                  ))
                )}
              </div>
            </div>
            {/* Best Authors */}
            <div className="flex flex-col w-full gap-3 h-2/5">
              <p className="text-darkest font-mediumPrimary border-b border-light pb-2">
                Top Writers
              </p>

              <div className="flex flex-col justify-start gap-3 h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loading size="3xl" color="dark" />
                  </div>
                ) : (
                  topWriters.map((author) => (
                    <TopWriter key={author._id} author={author} />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

TheChronicle.propTypes = {
  activeCategory: PropTypes.string.isRequired,
  searchSubmitted: PropTypes.bool.isRequired,
  searchFinalTerm: PropTypes.string.isRequired,
  setActiveCategory: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setSearchFinalTerm: PropTypes.func.isRequired,
};

export default TheChronicle;
