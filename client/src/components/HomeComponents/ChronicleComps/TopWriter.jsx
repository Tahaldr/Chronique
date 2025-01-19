import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import formatNumber from "../../../lib/formatNumber";

const TopWriter = ({ author }) => {
  return (
    <div className="flex justify-between items-center py-1 relative">
      {/* Author details */}
      <div className="flex items-center">
        <img
          src={author.authorDetails.userPic}
          alt={`${author.authorDetails.name} profile picture`}
          className="size-8 rounded-full absolute"
        />
        <div className="flex flex-col ml-12">
          <p className="font-mediumPrimary text-darkest hover:text-darker cursor-pointer text-base">
            <Link to={`/profile/${author.authorDetails._id}`}>
              {author.authorDetails.name}
            </Link>
          </p>
          <p className="text-sm font-small text-dark mt-[-5px]">
            {formatNumber(author.totalLikes)} votes
          </p>
        </div>
      </div>
      {/* Profile button */}
      <div>
        <Link to={`/profile/${author.authorDetails._id}`}>
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
        </Link>
      </div>
    </div>
  );
};

TopWriter.propTypes = {
  author: PropTypes.object.isRequired,
};

export default TopWriter;
