import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiArrowSmallUp } from "react-icons/hi2";

const ArrowScrollUp = () => {
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
          className="sticky z-20 flex top-5 justify-center w-full text-3xl"
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

export default ArrowScrollUp;
