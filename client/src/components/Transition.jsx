import { motion } from "framer-motion";
import PropTypes from "prop-types";
// import { useState } from "react";

const Transition = ({ OgComponent, ...props }) => {
  // const [showDiv, setShowDiv] = useState(true);

  return (
    <>
      <OgComponent {...props} />

      {/* Page Transition 1 */}

      {/* <motion.div
        className="fixed bottom-0 left-0 w-full h-screen origin-bottom z-50 bg-darker"
        initial={{ scaleY: 0 }}
        exit={{
          scaleY: 1,
          transition: { duration: 2, ease: [0.22, 1, 0.36, 1] },
        }}
      ></motion.div>
      {showDiv && (
        <motion.div
          className="fixed top-0 left-0 w-full h-screen origin-bottom bg-darker z-50"
          initial={{ opacity: 1 }}
          animate={{
            opacity: 0,
            transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
          }}
          onAnimationComplete={() => setShowDiv(false)}
        ></motion.div>
      )} */}

      {/* Page Transition 2 */}

      <motion.div
        className="fixed bottom-0 left-0 w-full h-screen origin-bottom z-50 bg-darker"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      ></motion.div>
      <motion.div
        className="fixed top-0 left-0 w-full h-screen origin-top z-50 bg-darker"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      ></motion.div>
    </>
  );
};

Transition.propTypes = {
  OgComponent: PropTypes.elementType.isRequired,
};

export default Transition;
