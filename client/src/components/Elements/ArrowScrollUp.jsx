import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiArrowSmallUp } from "react-icons/hi2";
import PropTypes from "prop-types";

const ArrowScrollUp = ({ type = "sticky" }) => {
  const [arrowUpShow, setArrowUpShow] = useState(false);

  // Show Arrow up ( if i scrolled more than 100vh show it ) :
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setArrowUpShow(true);
      } else {
        setArrowUpShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // console.log(window.scrollY);
  // console.log(window.innerHeight);

  return (
    <>
      {arrowUpShow && (
        <motion.div
          className={`
            ${type === "fixed" ? "fixed" : "sticky"}
            z-20 flex top-5 items-center justify-center w-full text-3xl`}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          // exit={{ y: -50, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <HiArrowSmallUp
            className="bg-lighter text-darker rounded-full border border-opacity-50 border-darker"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </motion.div>
      )}
    </>
  );
};

ArrowScrollUp.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ArrowScrollUp;
