import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { usePostStore } from "../../stores/usePostStore";
import { useInfiniteQuery } from "@tanstack/react-query";
// import from intersaction observer
import { useInView } from "react-intersection-observer";
import Loading from "../../components/Loading";
import showToast from "../../components/Toast";

const TheChronicle = ({ activeCategory }) => {
  const [sidebarTop, setSidebarTop] = useState(null);
  const sidebar = document.getElementById("sidebar");

  useEffect(() => {
    const handleScroll = () => {
      if (sidebar) {
        setSidebarTop(sidebar.getBoundingClientRect().top);
      }
    };
    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, [sidebar]);

  // Fetch posts data
  const { getPopularPosts, getCategoryPosts } = usePostStore();

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
    queryKey: ["posts", activeCategory],
    queryFn: ({ pageParam = 1 }) => {
      if (activeCategory === "Popular") {
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

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  // console.log("getPopularPosts",getPopularPosts());
  // console.log("data", data);

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
    <div className="flex">
      {/* Posts */}
      <div className="h-full w-2/3">
        <div className="w-full h-full">
          {data?.pages.map((group, i) => {
            return (
              <div key={i}>
                {group.posts.map((post, i) => (
                  <div key={post._id}>
                    <p>{i + 1}</p>
                    <p>Title: {post.title}</p>
                  </div>
                ))}
              </div>
            );
          })}

          {isFetching && isFetchingNextPage && (
            <div className="flex items-center justify-center h-10">
              <Loading size="3xl" color="dark" />
            </div>
          )}

          <div ref={ref}></div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="h-screen w-1/3 z-[-1]" id="sidebar">
        <motion.div
          className="bg-orange-400 z-10 h-full"
          style={
            sidebarTop <= 0 && sidebarTop != null && sidebarTop != undefined
              ? { position: "fixed", top: 0 }
              : {}
          }
          id="content_wrapper"
        >
          <div className="h-[300px] w-full bg-red-400">
            {activeCategory} Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Obcaecati nobis nulla ipsa at corporis maxime, eaque
            voluptates voluptatibus ullam quod? Atque cumque reiciendis
            doloribus hic repellendus dicta explicabo possimus obcaecati.
          </div>
          <div className="h-[300px] w-full bg-red-400"></div>
          <div className="h-[300px] w-full bg-red-400"></div>
          <div className="h-[300px] w-full bg-red-400"></div>
          <div className="h-[300px] w-full bg-red-400"></div>
        </motion.div>
      </div>
    </div>
  );
};

TheChronicle.propTypes = {
  activeCategory: PropTypes.string.isRequired,
};

export default TheChronicle;
