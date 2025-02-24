const CommentSidebar = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 z-[60] overflow-hidden">
      <img
        src="/OtherImg/CommentSidePaperCut.png"
        alt="Paper bg"
        className="w-full h-full object-cover pointer-events-none select-none"
        draggable="false"
      />
    </div>
  );
};

export default CommentSidebar;
