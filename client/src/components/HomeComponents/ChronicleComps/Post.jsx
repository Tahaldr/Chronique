import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbMessageCircle,
  TbMessageCircleFilled,
} from "react-icons/tb";
import { SlOptions } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import formatNumber from "../../../lib/formatNumber";
import { Link } from "react-router-dom";
import OptionsDropdown from "../../Elements/OptionsDropdown";
import PropTypes from "prop-types";

const Post = ({
  post,
  user,
  dropdownRef,
  index,
  i,
  handleLikePost,
  handleUnlikePost,
  setOptionsPosition,
  setOptionsShow,
  optionsPosition,
  setDeleteConfirm,
  commentHovered,
  setCommentHovered,
  optionsShow,
  searchSubmitted,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top section of post */}
      <div
        className="flex items-center justify-between px-1 relative"
        ref={dropdownRef}
      >
        <div>
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
              optionsPosition={optionsPosition}
              setDeleteConfirm={setDeleteConfirm}
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
              : `w-2/3 ${post.postPic !== "null" ? "gap-5 xl:gap-0" : "gap-5"}`
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
              {post.likes.find((like) => like === user?._id) ? (
                <TbArrowBigDownFilled className="text-lg rotate-180" />
              ) : (
                <TbArrowBigDown
                  className="text-lg rotate-180 hover:text-darker"
                  onClick={() => handleLikePost(post._id)}
                />
              )}
              <p className="text-sm">{formatNumber(post.likes.length)}</p>
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

            <p className="text-sm">{formatNumber(post.comments)}</p>
          </div>
        </div>
        <div>
          <p className="text-sm">
            {moment(post.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  dropdownRef: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  i: PropTypes.number.isRequired,
  handleLikePost: PropTypes.func.isRequired,
  handleUnlikePost: PropTypes.func.isRequired,
  setOptionsPosition: PropTypes.func.isRequired,
  setOptionsShow: PropTypes.func.isRequired,
  optionsPosition: PropTypes.object.isRequired,
  setDeleteConfirm: PropTypes.func.isRequired,
  commentHovered: PropTypes.object.isRequired,
  setCommentHovered: PropTypes.func.isRequired,
  optionsShow: PropTypes.bool.isRequired,
  searchSubmitted: PropTypes.bool.isRequired,
};

export default Post;
