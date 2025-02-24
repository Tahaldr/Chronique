import OptionsDropdown from "../Elements/OptionsDropdown";
import moment from "moment";
import formatNumber from "../../lib/formatNumber";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { SlOptions } from "react-icons/sl";
import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbMessageCircle,
  TbMessageCircleFilled,
} from "react-icons/tb";
import { useContext } from "react";
import { PostContext } from "../../App";
import showToast from "../Toast";

const PostTop = ({
  post,
  user,
  left,
  right,
  handleLikePost,
  handleUnlikePost,
}) => {
  const {
    dropdownRef,
    setOptionsPosition,
    optionsPosition,
    setOptionsShow,
    optionsShow,
    setDeleteConfirm,
    setCommentHovered,
    commentHovered,
  } = useContext(PostContext);

  return (
    <div
      className="flex items-center justify-between relative"
      ref={dropdownRef}
    >
      {/* Author details */}
      {left === "author" && (
        <div className="">
          <Link to={`/profile/${post.author._id}`}>
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
          </Link>
        </div>
      )}

      {/* Post Interactions */}
      {left === "interact" && (
        <div className="flex items-center gap-6 text-dark font-smallMediumItalic">
          {/* Post votes */}
          <div className="flex items-center gap-3 cursor-pointer">
            {/* Upvote */}
            <div className="flex items-center gap-1">
              {post.likes.find((like) => like === user?._id) ? (
                <TbArrowBigDownFilled className="text-lg rotate-180" />
              ) : (
                <TbArrowBigDown
                  className="text-lg rotate-180 hover:text-darker"
                  onClick={() => {
                    user
                      ? handleLikePost(post._id)
                      : showToast({
                          message: "You must be logged in to upvote",
                          type: "error",
                        });
                  }}
                />
              )}
              <p className="text-sm">{formatNumber(post.likes.length)}</p>
            </div>
            {/* Downvote */}
            <TbArrowBigDown
              className="text-lg hover:text-darker"
              onClick={() => {
                user
                  ? handleUnlikePost(post._id)
                  : showToast({
                      message: "You must be logged in to downvote",
                      type: "error",
                    });
              }}
            />
          </div>
          {/* Post comments */}
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
            onClick={() => setCommentSidebarOpen(post.)}
          >
            {commentHovered[post._id] ? (
              <TbMessageCircleFilled className="text-lg" />
            ) : (
              <TbMessageCircle className="text-lg" />
            )}

            <p className="text-sm">{formatNumber(post.comments)}</p>
          </div>
        </div>
      )}

      {/* Options */}
      {right === "options" && (
        <div className="px-1">
          {user && (
            <SlOptions
              className="text-3xl text-dark mr-[-8px] hover:text-darkest p-2 rounded-full hover-bg-lightish active:bg-light cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const { top } = e.target.getBoundingClientRect();
                if (top < window.innerHeight / 2) {
                  setOptionsPosition("up");
                } else {
                  setOptionsPosition("down");
                }
                // console.log(top);
                // console.log(window.innerHeight / 2);
                // console.log(optionsPosition);

                setOptionsShow((prev) => (prev === post._id ? null : post._id));
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
                setOptionsShow={setOptionsShow}
                optionsPosition={optionsPosition}
                setDeleteConfirm={setDeleteConfirm}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Post date */}
      {right === "date" && (
        <div className="text-dark font-smallMediumItalic">
          <p className="text-sm">
            {moment(post.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>
      )}
    </div>
  );
};

PostTop.propTypes = {
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  left: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired,
  handleLikePost: PropTypes.func.isRequired,
  handleUnlikePost: PropTypes.func.isRequired,
};

export default PostTop;
