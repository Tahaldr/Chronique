import { MdArrowBackIos } from "react-icons/md";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { PostContext } from "../../../App";
import PostTop from "../../PostComp/PostTop";
import PostPic from "../../PostComp/PostPic";

const Post = ({
  handleLikePost,
  handleUnlikePost,
  post,
  user,
  type,
  index,
  i,
  page,
}) => {
  const [textExpanded, setTextExpanded] = useState(false);
  const ContentRef = useRef(null);
  const [ContentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (ContentRef.current) {
      setContentHeight(ContentRef.current.scrollHeight);
    }
  }, [textExpanded]);

  const { dropdownRef, setOptionsShow, searchSubmitted } =
    useContext(PostContext);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click happens outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOptionsShow(null); // Close the dropdown
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [setOptionsShow, dropdownRef]);

  return (
    <div className="w-full gap-4">
      {/* Post top */}
      {page !== "details" && (
        <PostTop
          post={post}
          user={user}
          left="author"
          right="options"
          handleLikePost={handleLikePost}
          handleUnlikePost={handleUnlikePost}
        />
      )}

      {/* Middle section of post */}
      <div
        className={`${
          (index === 0 && i === 0 && type === "home" && !searchSubmitted) ||
          page === "details"
            ? "flex flex-col"
            : "flex justify-start"
        } gap-6 `}
      >
        {/* Post image */}
        <PostPic type={type} post={post} index={index} i={i} page={page} />

        {/* Post tops for Post details page */}
        {page === "details" && (
          <div className="order-2 flex flex-col gap-10">
            {/* first top post */}
            <PostTop
              post={post}
              user={user}
              left="author"
              right="date"
              handleLikePost={handleLikePost}
              handleUnlikePost={handleUnlikePost}
            />

            {/* second top post */}
            <PostTop
              post={post}
              user={user}
              left="interact"
              right="options"
              handleLikePost={handleLikePost}
              handleUnlikePost={handleUnlikePost}
            />
          </div>
        )}

        {/* Post details */}
        <div
          className={`
            ${
              index === 0 && i === 0 && type === "home" && !searchSubmitted
                ? `w-full ${page === "details" ? "gap-2" : "gap-5"}`
                : `w-full
                  ${
                    post.postPic !== "null"
                      ? page === "details"
                        ? "gap-2 xl:gap-0"
                        : "gap-5 xl:gap-0"
                      : page === "details"
                      ? "gap-2"
                      : "gap-5"
                  }`
            }
          flex flex-col jutify-between
            ${page === "details" && "order-1"}
          `}
        >
          <div className="h-full flex flex-col gap-2">
            {/* Post title */}
            <h3
              className={`${
                index === 0 && i === 0 && type === "home" && !searchSubmitted
                  ? "text-3xl"
                  : "text-2xl"
              } font-bigThird text-darker text-justify
                ${page === "details" ? "" : "hover:text-light"}
              `}
            >
              {page === "details" ? (
                <>{post.title}</>
              ) : (
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              )}
            </h3>
            {/* Post description */}
            {page !== "details" && (
              <p
                className={`${
                  index === 0 && i === 0 && type === "home" && !searchSubmitted
                    ? "line-clamp-6"
                    : "line-clamp-3"
                } text-darker font-smallMedium text-sm lg:text-base text-justify text-ellipsis`}
              >
                {post.description}
              </p>
            )}
          </div>
          {/* Post category */}
          <p
            className={`font-mediumPrimary w-fit
                        ${
                          page !== "details"
                            ? "bg-lightish py-1 px-4 text-xs text-darker"
                            : "text-dark"
                        }
              `}
          >
            {post.category}
          </p>
        </div>
      </div>

      {/* Post Content and tags */}
      {page === "details" && (
        <div>
          {/* Post content */}
          <div className="pb-20">
            <div className="pt-5 relative">
              {/* Content */}
              <div
                ref={ContentRef}
                className={`${
                  textExpanded ? "h-fit" : "max-h-[800px] overflow-hidden"
                }`}
              >
                <pre className="whitespace-pre-wrap text-justify">
                  {post.content}
                </pre>
              </div>

              {/* Content fade */}
              {!textExpanded && ContentHeight > 800 && (
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-lighter to-transparent"></div>
              )}
            </div>

            {/* Arrow */}
            {ContentHeight > 800 && (
              <div className="flex justify-center items-center h-14">
                <MdArrowBackIos
                  className={`text-darkish text-xl ${
                    textExpanded ? "rotate-90" : "-rotate-90"
                  } hover:text-darker cursor-pointer`}
                  onClick={() => setTextExpanded(!textExpanded)}
                />
              </div>
            )}
          </div>

          {/* Post Tags */}
          <div>
            <div className="flex flex-wrap gap-2 pb-5">
              {post.tags.map((tag, index) => (
                <p
                  key={index}
                  className="font-smallMedium text-sm text-darkish bg-lightish px-5 cursor-pointer"
                >
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom section of post */}
      <PostTop
        post={post}
        user={user}
        left="interact"
        right={page === "details" ? "none" : "date"}
        handleLikePost={handleLikePost}
        handleUnlikePost={handleUnlikePost}
      />
    </div>
  );
};

Post.propTypes = {
  type: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  dropdownRef: PropTypes.object.isRequired,
  index: PropTypes.number,
  i: PropTypes.number,
  handleLikePost: PropTypes.func.isRequired,
  handleUnlikePost: PropTypes.func.isRequired,
  setOptionsPosition: PropTypes.func.isRequired,
  setOptionsShow: PropTypes.func.isRequired,
  optionsPosition: PropTypes.object.isRequired,
  setDeleteConfirm: PropTypes.func.isRequired,
  commentHovered: PropTypes.object.isRequired,
  setCommentHovered: PropTypes.func.isRequired,
  optionsShow: PropTypes.bool.isRequired,
  searchSubmitted: PropTypes.bool, // not required
  page: PropTypes.string.isRequired,
};

export default Post;
