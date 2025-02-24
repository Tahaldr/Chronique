import { useEffect } from "react";
import { motion } from "framer-motion";
import PostComments from "../../PostComp/PostComments";

const CommentSidebar = () => {
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
    </>
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-[60] overflow-hidden select-none">
      <motion.img
        src="/OtherImg/CommentPaperCutHalf.png"
        alt="Paper bg"
        className="pointer-events-none absolute top-0 right-0"
        draggable="false"
      />
      <p className="w-[500px] h-full px-5 py-5 absolute top-0 right-0 overflow-scroll">
        <PostComments PostId="676a8e5b970b6b88d66e77aa" type="full" />
      </p>
    </div>
  );
};

export default CommentSidebar;
