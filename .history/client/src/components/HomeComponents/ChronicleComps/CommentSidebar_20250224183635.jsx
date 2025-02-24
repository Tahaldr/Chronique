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
        <div className="w-full h-full relative">
          <motion.img
            src="/OtherImg/CommentPaperCutHalf.png"
            alt="Paper bg"
            className="pointer-events-none bg-repeat-y w-[583px] h-full absolute top-0 right-0"
            draggable="false"
          />
          <div className="w-[450px] min-[600px]:w-[530px]  h-full px-5 py-5 absolute top-0 right-0 overflow-scroll flex flex-col gap-5">
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
      </div>
    </>
  );
};

CommentSidebar.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSidebar;
