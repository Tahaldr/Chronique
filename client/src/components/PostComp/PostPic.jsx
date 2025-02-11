import { motion } from "framer-motion";
import { useContext } from "react";
import { PostContext } from "../../App";
import PropsTypes from "prop-types";

const PostPic = ({ type, post, index, i, page }) => {
  const { searchSubmitted } = useContext(PostContext);

  return (
    <>
      {post.postPic !== "null" && (
        <div
          className={`${
            (index === 0 && i === 0 && type === "home" && !searchSubmitted) ||
            page === "details"
              ? "aspect-[16/9]"
              : `aspect-[8/5] h-fit ${
                  post.postPic === "null" ? "w-full" : "w-2/3"
                }`
          }
          ${page === "details" && "order-3"}
          overflow-hidden cursor-pointer border-[1px] border-opacity-30 border-dark`}
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
    </>
  );
};

PostPic.propTypes = {
  type: PropsTypes.string,
  post: PropsTypes.object,
  index: PropsTypes.number,
  i: PropsTypes.number,
  page: PropsTypes.string,
};

export default PostPic;
