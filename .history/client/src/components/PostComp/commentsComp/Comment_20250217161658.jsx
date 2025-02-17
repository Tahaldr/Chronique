import moment from "moment";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { TbArrowBigDown, TbArrowBigDownFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import showToast from "../../Toast";
import formatNumber from "../../../lib/formatNumber";
import { useUserStore } from "../../../stores/useUserStore";
import { AnimatePresence } from "framer-motion";
import OptionsDropdown from "../../Elements/OptionsDropdown";
import { PostContext } from "../../../App";

const Comment = ({
  PostId,
  comment,
  handleLikeComment,
  handleUnlikeComment,
}) => {
  const [optionsPosition, setOptionsPosition] = useState("up");
  const [optionsShow, setOptionsShow] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const contentRef = useRef(null);

  const { setDeleteConfirm } = useContext(PostContext);
  const { user } = useUserStore();

  // Calculate line count
  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      const elementHeight = element.offsetHeight;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      setLineCount(Math.round(elementHeight / lineHeight));
    }
  }, [comment.content, commentExpanded]);

  // Check if comment is long
  const charLimit = 250;
  const maxLines = 6;
  const isLongText = comment.content.length > charLimit;
  const isManyLines = lineCount > maxLines;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Top section */}
        <div className="flex items-center justify-between">
          {/* Author info */}
          <Link
            className="flex items-center gap-2 cursor-pointer"
            to={`/profile/${comment.author._id}`}
          >
            <img
              src={comment.author.userPic}
              alt="author pic"
              className="size-8 object-cover rounded-full"
            />
            <div className="flex flex-col gap-0">
              <p className="font-mediumPrimary text-darker hover:underline">
                {comment.author.name}
              </p>
              <p className="font-small text-sm text-dark">
                {moment(comment.createdAt).fromNow()}
              </p>
            </div>
          </Link>
          {/* Options */}
          <div className="relative">
            {user && (
              <SlOptions
                className="text-3xl text-dark -mr-2 hover:text-darkest p-2 rounded-full hover-bg-lightish active:bg-light cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const { top } = e.target.getBoundingClientRect();
                  if (top < window.innerHeight / 2) {
                    setOptionsPosition("up");
                  } else {
                    setOptionsPosition("down");
                  }

                  setOptionsShow((prev) =>
                    prev === comment._id ? null : comment._id
                  );
                }}
              />
            )}

            {/* Options Dropdown */}
            <AnimatePresence>
              {/* {optionsShow === comment._id && <CommentOptionsDropDown />} */}
              {optionsShow === comment._id && (
                <OptionsDropdown
                  user={user}
                  modelId={comment._id}
                  modelAuthor={comment.author}
                  optionsPosition={optionsPosition}
                  setDeleteConfirm={setDeleteConfirm}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle section */}
        <div>
          <pre
            ref={contentRef}
            className="font-small whitespace-pre-wrap transition-all duration-300 overflow-hidden"
            style={{
              maxHeight: !commentExpanded && isManyLines ? "9em" : "none", // 9em ≈ 6 lines
            }}
          >
            {isLongText && !commentExpanded
              ? `${comment.content.slice(0, charLimit)}...`
              : comment.content}
          </pre>

          {(isLongText || isManyLines) && (
            <span
              className="text-sm font-smallSemiBold text-darkish hover:underline cursor-pointer ml-1"
              onClick={() => setCommentExpanded(!commentExpanded)}
            >
              {commentExpanded ? "Show less" : "Read more"}
            </span>
          )}
        </div>

        {/* Bottom section */}
        <div>
          {/* Comment votes */}
          <div className="flex items-center gap-3 cursor-pointer text-dark font-smallMediumItalic">
            {/* Upvote */}
            <div className="flex items-center gap-1">
              {comment.votes.find((vote) => vote === user?._id) ? (
                <TbArrowBigDownFilled className="text-lg rotate-180" />
              ) : (
                <TbArrowBigDown
                  className="text-lg rotate-180 hover:text-darker"
                  onClick={() => {
                    user
                      ? handleLikeComment(comment._id)
                      : showToast({
                          message: "You must be logged in to upvote",
                          type: "error",
                        });
                  }}
                />
              )}
              <p className="text-sm">{formatNumber(comment.votes.length)}</p>
            </div>
            {/* Downvote */}
            <TbArrowBigDown
              className="text-lg hover:text-darker"
              onClick={() => {
                user
                  ? handleUnlikeComment(comment._id)
                  : showToast({
                      message: "You must be logged in to downvote",
                      type: "error",
                    });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Comment.propTypes = {
  PostId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  handleLikeComment: PropTypes.func.isRequired,
  handleUnlikeComment: PropTypes.func.isRequired,
};

export default Comment;
