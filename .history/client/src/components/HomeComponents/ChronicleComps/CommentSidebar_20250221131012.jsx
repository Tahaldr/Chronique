import { useEffect } from "react";

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
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-[60] overflow-hidden select-none">
      <img
        src="/OtherImg/CommentSidePaperCut.png"
        alt="Paper bg"
        className="w-full h-full object-cover pointer-events-none"
        draggable="false"
      />
      p
    </div>
  );
};

export default CommentSidebar;
