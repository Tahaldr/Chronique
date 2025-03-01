import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ConfirmWindow = ({ confirming, handleFunc, type }) => {
  const confirmBoxRef = useRef(null);

  useEffect(() => {
    // Disable scrolling but keep the scrollbar visible
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // Restore original styles when modal is closed
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        confirmBoxRef.current &&
        !confirmBoxRef.current.contains(event.target)
      ) {
        confirming({ postId: null, confirming: false });
      }
    };

    // Add the event listener only when the modal is active
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [confirming]);

  return (
    <motion.div
      className="w-screen h-screen fixed z-50 top-0 left-0 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // not working
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div
        ref={confirmBoxRef}
        className="flex flex-col items-center justify-center gap-6 
            h-1/3 md:w-1/2 lg:w-1/3 relative "
      >
        <img
          src="/OtherImg/ToastCustomPaper.png"
          alt="ToastBg"
          className="bg-no-repeat absolute w-full h-full z-[-1]"
        />

        {/* Confirmation */}
        <div className="flex flex-col items-center justify-center gap-1">
          <h5 className="text-xl text-darker font-mediumPrimary">
            Are you sure?
          </h5>
          <p className="text-darker font-small text-base text-center w-2/3">
            are you sure you want to do this action? This action cannot be
            undone
          </p>
        </div>
        <div className="flex gap-8">
          <button
            onClick={() => {
              if (type === "post") {
                confirming({ postId: null, confirming: false });
              } else {
                confirming({ commentId: null, confirming: false });
              }
            }}
            className="flex place-items-center text-lg text-lightest bg-dark
                hover:bg-darkest px-6 font-bigPrimary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleFunc();
              if (type === "post") {
                confirming({ postId: null, confirming: false });
              } else {
                confirming({ commentId: null, confirming: false });
              }
            }}
            className="flex place-items-center text-lg text-lightest bg-dark
                hover:bg-red-800 px-6 font-bigPrimary"
          >
            Confirm
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ConfirmWindow.propTypes = {
  confirming: PropTypes.func.isRequired,
  handleFunc: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ConfirmWindow;
