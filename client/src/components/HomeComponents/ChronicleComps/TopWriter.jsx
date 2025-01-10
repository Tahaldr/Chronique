import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const TopWriter = ({ author }) => {
  function formatNumber(num) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0+$/, "") + "m";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0+$/, "") + "k";
    } else {
      return num.toString();
    }
  }

  return (
    <div className="h-full flex justify-between items-center relative">
      {/* Author details */}
      <div className="flex items-center">
        <img
          src={author.authorDetails.userPic}
          alt={`${author.authorDetails.name} profile picture`}
          className="size-8 rounded-full absolute"
        />
        <div className="flex flex-col ml-12">
          <p className="font-mediumPrimary text-darkest text-base">
            {author.authorDetails.name}
          </p>
          <p className="text-sm font-smallItalic text-dark mt-[-5px]">
            {formatNumber(author.totalLikes)} votes
          </p>
        </div>
      </div>
      {/* Profile button */}
      <div>
        <motion.button
          className="text-sm font-smallSemiBold text-darkish border-darkish hover:border-darker hover:text-darker flex items-center border rounded-[100%] px-4"
          whileHover={{
            padding: "0 18px",
            transition: { duration: 0.2, ease: "easeInOut" },
          }}
        >
          {/* View Profile */}
          <HiOutlineArrowLongRight className="text-xl" />
        </motion.button>
      </div>
    </div>
  );
};

TopWriter.propTypes = {
  author: PropTypes.object.isRequired,
};

export default TopWriter;
