import PropTypes from "prop-types";
import CommentForm from "./commentsComp/CommentForm";
import Comment from "./commentsComp/Comment";
import { useCommentStore } from "../../stores/useCommentStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import showToast from "../Toast";
import { useUserStore } from "../../stores/useUserStore";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const PostComments = ({ PostId, type }) => {
  const { getComments } = useCommentStore();
  const { user } = useUserStore();
  const { ref, inView } = useInView();

  // console.log(getComments(PostId, 10, 1));

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
    queryKey: ["comments", PostId],
    queryFn: ({ pageParam = 1 }) =>
      getComments(PostId, type === "mini" ? 3 : 10, pageParam),
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-24">
        <Loading size="3xl" color="dark" />
      </div>
    );

  if (isError) {
    showToast({ message: error.message, type: "error" });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* comment form */}
      {user ? (
        <div>
          <CommentForm PostId={PostId} />
        </div>
      ) : (
        // HANDLE LATER
        <p>HANDLE LATER when user is not logged in </p>
      )}
      {/* comments */}
      <div>
        {data.pages ? (
          <div className="flex flex-col gap-5">
            {data?.pages.map((group, i) => (
              <div key={i} className="flex flex-col gap-5">
                {group.comments.map((post) => (
                  <div key={post._id} className="">
                    {/* Comment Component */}
                    <Comment PostId={PostId} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-screen md:w-full h-full flex flex-col items-center justify-center p-28 font-mediumPrimary text-lg leading-6">
            <p className="text-dark">No comments yet ...</p>
            <p className="text-darkest flex items-center gap-1">
              be the first to share your thoughts
            </p>
          </div>
        )}

        {isFetching && isFetchingNextPage && (
          <div className="flex items-center justify-center h-10">
            <Loading size="3xl" color="dark" />
          </div>
        )}

        {type !== "mini" && <div ref={ref} className="h-20"></div>}
      </div>
      {/* SeeMore btn */}
      {type === "mini" && (
        <div className="flex items-center justify-center w-full">
          <button className="text-sm font-smallMedium text-dark py-2 px-5 border border-light hover:text-darkest hover:border-dark rounded-full">
            See all comments
          </button>
        </div>
      )}
    </div>
  );
};

PostComments.propTypes = {
  PostId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default PostComments;
