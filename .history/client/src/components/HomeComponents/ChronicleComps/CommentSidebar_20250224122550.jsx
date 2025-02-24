import { useEffect } from "react";
import { motion } from "framer-motion";
import PostComments from "../../PostComp/PostComments";
import { GrSidebar } from "react-icons/gr";
import { CgSidebarRight } from "react-icons/cg";
import { HiArrowSmallUp } from "react-icons/hi2";

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
      <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-[60] overflow-hidden select-none">
        <motion.img
          src="/OtherImg/CommentPaperCutHalf.png"
          alt="Paper bg"
          className="pointer-events-none absolute top-0 right-0"
          draggable="false"
        />
        <div className="w-[500px] h-full px-5 py-5 absolute top-0 right-0 overflow-scroll flex flex-col gap-5">
          <div>
            <HiArrowSmallUp className="text-3xl textdarkish cursor-pointer rotate-90 p-1 rounded-full border border-darkish" />
          </div>
          <PostComments PostId="676a8e5b970b6b88d66e77aa" type="full" />
        </div>
      </div>
    </>
  );
};

export default CommentSidebar;
