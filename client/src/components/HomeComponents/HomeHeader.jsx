import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";

const HomeHeader = ({ navY }) => {
  const [titleHovered, setTitleHovered] = useState(false);

  return (
    <motion.div
      className="w-full h-full flex place-items-center"
      style={{ y: navY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="w-1/4 h-full">
        <div className="border border-darker text-darker font-smallMediumItalic px-3 hidden md:flex flex-col justify-center items-center w-full h-full text-xs lg:text-sm">
          <h5 className="font-smallBoldItalic text-center">Why We Write</h5>
          <p>
            &quot;In a world of fleeting moments, we capture the stories that
            matter most__ insightful, bold, and unfiltered.&quot;
          </p>
        </div>
      </div>
      <div className="w-full md:w-2/4 text-center text-darkest flex justify-center">
        <AnimatePresence>
          <motion.h1
            className="text-7xl lg:text-8xl font-bigPrimary cursor-default relative text-center"
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            animate={
              titleHovered ? { letterSpacing: "2px" } : { letterSpacing: 0 }
            }
          >
            Chronique
            {/* Line under Title  */}
            <span className="w-full h-[1px] bg-light absolute right-0 bottom-6 lg:bottom-8 z-[-1]"></span>
          </motion.h1>
        </AnimatePresence>
      </div>
      <div className="w-1/4 h-full">
        <div className="border border-darker text-darker font-smallMediumItalic px-3 hidden md:flex flex-col justify-center items-center w-full h-full text-xs lg:text-sm">
          <h5 className="font-smallBoldItalic text-center">The Date Speaks</h5>
          <p>
            Today {moment().format("dddd, Do MMMM, YYYY")}__ bringing you the
            stories that define the moment.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeHeader;

HomeHeader.propTypes = {
  navY: PropTypes.object.isRequired,
};
