import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePostStore } from "../../stores/usePostStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Loading from "../../components/Loading";
import showToast from "../../components/Toast";
import RecentPost from "../../components/HomeComponents/ChronicleComps/RecentPost";
import moment from "moment";
import { MdOutlinePostAdd } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { TbArrowBigDown, TbArrowBigDownFilled } from "react-icons/tb";
import { TbMessageCircle, TbMessageCircleFilled } from "react-icons/tb";
import { HiArrowSmallUp } from "react-icons/hi2";
import { useUserStore } from "../../stores/useUserStore";
import OptionsDropdown from "../../components/Elements/OptionsDropdown";
import { Toaster } from "react-hot-toast";
import TopWriter from "../../components/HomeComponents/ChronicleComps/TopWriter";

const TheChronicle = ({
  activeCategory,
  searchSubmitted,
  searchFinalTerm,
  setActiveCategory,
  setSearchSubmitted,
  searchTerm,
  setSearchFinalTerm,
  setSearchTerm,
}) => {
  const sidebarRef = useRef(null);
  const [sidebarTop, setSidebarTop] = useState(null);
  const [commentHovered, setCommentHovered] = useState({});
  const [arrowUpShow, setArrowUpShow] = useState(false);
  const [optionsShow, setOptionsShow] = useState(null);
  const [optionsPosition, setOptionsPosition] = useState("up");
  const [recentPosts, setRecentPosts] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const { ref, inView } = useInView();
  const dropdownRef = useRef(null); // Ref to track the dropdown container

  // Stores
  const {
    loading,
    getPopularPosts,
    getTopWriters,
    getCategoryPosts,
    getRecentPosts,
    searchPosts,
    likePost,
    unlikePost,
  } = usePostStore();
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click happens outside the dropdown
      if (!event.target.closest(".options-dropdown")) {
        setOptionsShow(null); // Close the dropdown
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // console.log("getComments", getComments("676a8e5b970b6b88d66e77aa"));
  // console.log("getPopularPosts", getPopularPosts());
  // console.log("getCategoryPosts", getCategoryPosts("Technology"));
  // console.log("getRecentPosts", getRecentPosts());
  // console.log("getTopWriters", getTopWriters());

  // Format number
  function formatNumber(num) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0+$/, "") + "m";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0+$/, "") + "k";
    } else {
      return num.toString();
    }
  }

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

  // Show Arrow up ( if i scrolled more than 100vh show it ) :
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setArrowUpShow(true);
      } else {
        setArrowUpShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading size="3xl" color="dark" />
      </div>
    );
  // if error showToast :
  if (isError) {
    showToast({ message: error.message, type: "error" });
  }

  return (
    <>
      <Toaster />
      <div className="flex">
        {/* Main Posts */}
        <div className="h-full md:w-2/3 relative">
          {arrowUpShow && (
            <motion.div
              className="sticky z-20 flex top-5 justify-center w-full text-3xl"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              // exit={{ y: -50, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <HiArrowSmallUp
                className="bg-lighter text-darker rounded-full border border-opacity-50 border-darker"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            </motion.div>
          )}

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

          {data.pages ? (
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
                      <div className="w-full flex flex-col gap-4">
                        {/* Top section of post */}
                        <div
                          className="flex items-center justify-between px-1 relative"
                          ref={dropdownRef}
                        >
                          <div>
                            {user && post.author._id === user._id ? (
                              <p className="cursor-pointer font-mediumSecondary text-darker bg-lightish hover:bg-light hover:text-lightest px-5">
                                You
                              </p>
                            ) : (
                              <p className="cursor-pointer font-mediumSecondary text-darker">
                                by{" "}
                                <span className="lowercase hover:text-darkest hover:underline">
                                  {post.author.name}
                                </span>
                              </p>
                            )}
                          </div>
                          {user && (
                            <SlOptions
                              className="text-3xl text-dark mr-[-8px] hover:text-darkest p-2 rounded-full hover-bg-lightish active:bg-light cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                const { top } =
                                  e.target.getBoundingClientRect();
                                if (top < window.innerHeight / 2) {
                                  setOptionsPosition("up");
                                } else {
                                  setOptionsPosition("down");
                                }
                                console.log(top);
                                console.log(window.innerHeight / 2);
                                console.log(optionsPosition);

                                setOptionsShow((prev) =>
                                  prev === post._id ? null : post._id
                                );
                              }}
                            />
                          )}
                          {/* Options Dropdown */}
                          <AnimatePresence>
                            {optionsShow === post._id && (
                              <OptionsDropdown
                                user={user}
                                postId={post._id}
                                postAuthor={post.author}
                                optionsPosition={optionsPosition}
                              />
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Middle section of post */}
                        <div
                          className={`${
                            index === 0 && i === 0 && !searchSubmitted
                              ? "flex flex-col "
                              : "flex justify-start "
                          } gap-6 `}
                        >
                          {post.postPic !== "null" && (
                            <div
                              className={`${
                                index === 0 && i === 0 && !searchSubmitted
                                  ? "aspect-[16/9]"
                                  : "aspect-[8/5] w-1/3 h-fit"
                              } overflow-hidden cursor-pointer border-[1px] border-opacity-30 border-dark`}
                              onClick={() => {
                                // Get post details
                              }}
                            >
                              <motion.img
                                src={post.postPic}
                                alt={post.title + " image"}
                                className="w-full h-full object-cover"
                                whileHover={{
                                  scale: 1.03,
                                  transition: {
                                    duration: 0.3,
                                    ease: "easeInOut",
                                  },
                                }}
                              />
                            </div>
                          )}

                          <div
                            className={`${
                              index === 0 && i === 0 && !searchSubmitted
                                ? "w-full gap-5"
                                : `w-2/3 ${
                                    post.postPic !== "null"
                                      ? "gap-5 xl:gap-0"
                                      : "gap-5"
                                  }`
                            } flex flex-col jutify-between `}
                          >
                            <div className="h-full  flex flex-col lg:gap-2">
                              <h3
                                className={`${
                                  index === 0 && i === 0 && !searchSubmitted
                                    ? "text-3xl"
                                    : "text-2xl"
                                } font-bigThird text-darker text-justify hover:text-light cursor-pointer`}
                              >
                                <a href="">{post.title}</a>
                              </h3>
                              <p
                                className={`${
                                  index === 0 && i === 0 && !searchSubmitted
                                    ? "line-clamp-6"
                                    : "line-clamp-3"
                                } text-darker font-smallMedium text-sm lg:text-base text-justify text-ellipsis`}
                              >
                                {post.description}
                              </p>
                            </div>
                            <p className="text-darker bg-lightish font-mediumPrimary text-xs w-fit py-1 px-4">
                              {post.category}
                            </p>
                          </div>
                        </div>
                        {/* Bottom section of post */}
                        <div className="flex items-center justify-between text-dark font-smallMediumItalic">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                {post.likes.find(
                                  (like) => like === user?._id
                                ) ? (
                                  <TbArrowBigDownFilled className="text-lg rotate-180" />
                                ) : (
                                  <TbArrowBigDown
                                    className="text-lg rotate-180 hover:text-darker"
                                    onClick={() => handleLikePost(post._id)}
                                  />
                                )}
                                <p className="text-sm">
                                  {formatNumber(post.likes.length)}
                                </p>
                              </div>
                              <TbArrowBigDown
                                className="text-lg hover:text-darker"
                                onClick={() => handleUnlikePost(post._id)}
                              />
                            </div>
                            <div
                              className="flex items-center gap-1 hover:text-darker cursor-pointer"
                              onMouseEnter={() =>
                                setCommentHovered((prev) => ({
                                  ...prev,
                                  [post._id]: true,
                                }))
                              }
                              onMouseLeave={() =>
                                setCommentHovered((prev) => ({
                                  ...prev,
                                  [post._id]: false,
                                }))
                              }
                              onClick={() => {
                                // Get comments
                              }}
                            >
                              {commentHovered[post._id] ? (
                                <TbMessageCircleFilled className="text-lg" />
                              ) : (
                                <TbMessageCircle className="text-lg" />
                              )}

                              <p className="text-sm">
                                {formatNumber(post.comments)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm">
                              {moment(post.createdAt).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                      </div>
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
            className="w-full h-full border-l border-light p-5 flex flex-col gap-1"
            style={
              sidebarTop <= 0 && sidebarTop != null && sidebarTop != undefined
                ? { position: "fixed", top: 0, width: "33.333333%" }
                : {}
            }
            id="content_wrapper"
          >
            {/* Recent Posts */}
            <div className="flex flex-col w-full gap-3 h-2/3">
              <p className="text-darkest font-mediumPrimary border-b border-light pb-1">
                Latest Headlines
              </p>
              <div className="flex flex-col h-full">
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
            <div className="flex flex-col gap-3 h-1/3">
              <p className="text-darkest font-mediumPrimary border-b border-light pb-1">
                Top Writers
              </p>

              <div className="flex flex-col gap-2 h-full">
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
  setSearchSubmitted: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setSearchFinalTerm: PropTypes.func.isRequired,
};

export default TheChronicle;
