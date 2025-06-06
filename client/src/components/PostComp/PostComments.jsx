import PropTypes from 'prop-types';
import CommentForm from './commentsComp/CommentForm';
import Comment from './commentsComp/Comment';
import { useCommentStore } from '../../stores/useCommentStore';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../Loading';
import showToast from '../Toast';
import { useUserStore } from '../../stores/useUserStore';
import { useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ConfirmWindow from '../Elements/ConfirmWindow';
import { CommentContext } from '../../App';
import formatNumber from '../../lib/formatNumber';

const PostComments = ({ PostId, type }) => {
  const { getComments, createComment, likeComment, unlikeComment, deleteComment } =
    useCommentStore();
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const { commentDeleteConfirm, setCommentDeleteConfirm, setCommentSidebarOpen } =
    useContext(CommentContext);

  // const commentContext = useContext(CommentContext) || {}; // Prevent null error
  // const { commentDeleteConfirm = {}, setCommentDeleteConfirm = () => {} } =
  //   commentContext;

  // console.log(getComments(PostId, 10, 1));

  const queryKey = type === 'mini' ? ['comments-mini', PostId] : ['comments', PostId];

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
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      return getComments(PostId, type === 'mini' ? 3 : 10, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return null;
    },
  });

  // console.log("data", data);

  // handle comment creation
  const handleCreateComment = async (comment) => {
    try {
      const data = await createComment(PostId, comment); // API call to create comment
      const newComment = data.comment;

      if (!newComment || !newComment._id) {
        console.error('Invalid comment data:', newComment);
        showToast({ message: 'Failed to add comment.', type: 'error' });
        return;
      }

      console.log('New Comment:', newComment);

      const queryKey = type === 'mini' ? ['comments-mini', PostId] : ['comments', PostId];

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                comments: [newComment, ...page.comments],
                totalComments: page.totalComments + 1,
              };
            }
            return page;
          }),
        };
      });

      showToast({ message: 'Comment added successfully.', type: 'success' });
    } catch (error) {
      console.error('Failed to create comment:', error);
      showToast({ message: 'Failed to add comment.', type: 'error' });
    }
  };

  // handle comment upvote
  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId); // Perform the API call to like the comment

      const queryKey = type === 'mini' ? ['comments-mini', PostId] : ['comments', PostId];

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.map((comment) =>
              comment._id === commentId
                ? { ...comment, votes: [...comment.votes, user?._id] }
                : comment
            ),
          })),
        };
        return newData;
      });
    } catch (error) {
      console.log(error);
      showToast({ message: 'Failed to upvote the comment.', type: 'error' });
    }
  };

  // handle comment downvote
  const handleUnlikeComment = async (commentId) => {
    try {
      await unlikeComment(commentId); // Perform the API call to remove the vote

      const queryKey = type === 'mini' ? ['comments-mini', PostId] : ['comments', PostId];

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    votes: comment.votes.filter((vote) => vote !== user?._id),
                  }
                : comment
            ),
          })),
        };
        return newData;
      });
    } catch (error) {
      console.log(error);
      showToast({
        message: 'Failed to remove vote from the comment.',
        type: 'error',
      });
    }
  };

  // handle comment delete
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId); // API call to delete the comment

      const queryKey = type === 'mini' ? ['comments-mini', PostId] : ['comments', PostId];

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((comment) => comment._id !== commentId),
          })),
        };
        return newData;
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-24'>
        <Loading size='3xl' color='dark' />
      </div>
    );

  if (isError) {
    showToast({ message: error.message, type: 'error' });
  }

  return (
    <>
      {commentDeleteConfirm.commentId && commentDeleteConfirm.confirming && (
        <ConfirmWindow
          confirming={setCommentDeleteConfirm}
          handleFunc={() => handleDeleteComment(commentDeleteConfirm.commentId)}
          type='comment'
        />
      )}
      <div className='flex flex-col gap-8'>
        <h4 className='font-smallSemiBold text-darker'>
          Comments ({formatNumber(data?.pages[0]?.totalComments)})
        </h4>
        {/* comment form */}
        {user && (
          <div>
            <CommentForm PostId={PostId} handleCreateComment={handleCreateComment} />
          </div>
        )}
        {/* comments */}
        <div className='w-full'>
          {data.pages && data?.pages[0]?.totalComments > 0 ? (
            <div className='flex flex-col gap-7'>
              {data?.pages.map((group, i) => (
                <div key={i} className='flex flex-col gap-7'>
                  {group.comments.map((comment) => (
                    <div key={comment._id} className=''>
                      {/* Comment Component */}
                      <Comment
                        comment={comment}
                        handleLikeComment={handleLikeComment}
                        handleUnlikeComment={handleUnlikeComment}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className='w-full md:w-full text-center h-full flex flex-col items-center justify-center p-28 font-mediumPrimary text-lg leading-6'>
              <p className='text-dark'>No comments yet ...</p>
              <p className='text-darkest flex items-center gap-1'>
                be the first to share your thoughts
              </p>
            </div>
          )}

          {isFetching && isFetchingNextPage && (
            <div className='flex items-center justify-center h-10'>
              <Loading size='3xl' color='dark' />
            </div>
          )}

          {type !== 'mini' && <div ref={ref} className='h-20'></div>}
        </div>
        {/* SeeMore btn */}
        {type === 'mini' && (
          <div className='flex items-center justify-center w-full'>
            <button
              className='text-sm font-smallMedium text-dark py-2 px-5 border border-light hover:text-darkest hover:border-dark rounded-full'
              onClick={() => setCommentSidebarOpen(PostId)}>
              See all comments
            </button>
          </div>
        )}
      </div>
    </>
  );
};

PostComments.propTypes = {
  PostId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default PostComments;
