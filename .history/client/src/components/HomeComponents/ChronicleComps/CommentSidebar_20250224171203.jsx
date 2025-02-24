import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import PostComments from "../../PostComp/PostComments";
import { HiArrowSmallUp } from "react-icons/hi2";
import { CommentContext } from "../../../App";
import PropTypes from "prop-types";

const CommentSidebar = ({ postId }) => {
  const { setCommentSidebarOpen } = useContext(CommentContext);

  useEffect(() => {
    // Disable scrolling but keep the scrollbar visible
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // Restore original styles when the sidebar is closed
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  return (
    <>
      <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-[60] overflow-hidden select-none">
        <motion.img
          src="/OtherImg/CommentPaperCutHalf.png"
          alt="Paper bg"
          className="pointer-events-none bg-repeat-y absolute top-0 right-0 
    w-[150%] h-full sm:[583px]" // Increase width on small screens
          draggable="false"
        />

        <div
          className="absolute top-0 right-0 h-full overflow-scroll flex flex-col gap-5 
              w-full px-5 py-5 
              sm:[500px] sm:px-10"
        >
          <div>
            <HiArrowSmallUp
              className="text-3xl text-darkish cursor-pointer rotate-90 p-1 rounded-full border border-darkish
            hover:border-darker hover:text-darker"
              onClick={() => setCommentSidebarOpen(null)}
            />
          </div>
          <PostComments PostId={postId} type="full" />
        </div>
      </div>
    </>
  );
};

CommentSidebar.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSidebar;
