import PropTypes from "prop-types";
import { useUserStore } from "../../../stores/useUserStore";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CommentForm = ({ handleCreateComment }) => {
  const [commentFocused, setCommentFocused] = useState(false);
  const [commentContent, setCommentContent] = useState({
    content: "",
  });
  const textareaRef = useRef(null);

  const { user } = useUserStore();

  // Adjust height dynamically
  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to fit content
  };

  // Reset the textarea height when the content is cleared
  useEffect(() => {
    if (commentContent.content === "") {
      const textarea = textareaRef.current;
      textarea.style.height = "auto"; // Reset height when content is cleared
    }
  }, [commentContent.content]);

  return (
    <div
      className={`flex flex-col gap-3 w-full border border-light pt-3 px-6 overflow-hidden relative ${
        commentFocused ? "pb-24" : "pb-3"
      }`}
    >
      {/* user info */}
      <AnimatePresence>
        {commentFocused && (
          <motion.div
            key="user-info"
            className="flex items-center gap-2 absolute"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -10,
              transition: { duration: 0.7, ease: [0, 0.71, 0.2, 1.01] },
            }}
            transition={{ duration: 0.7, ease: [0, 0.71, 0.2, 1.01] }}
          >
            <img
              src={user?.userPic || "/default-profile.png"}
              alt="user profile"
              className="size-7 rounded-full object-cover"
            />
            <p className="font-mediumPrimary text-darker">{user?.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* comment input */}
      <motion.div
        className="w-full"
        animate={{
          height: commentFocused ? "auto" : 20,
          y: commentFocused ? 40 : 0,
        }}
        transition={{ duration: 0.7, ease: [0, 0.71, 0.2, 1.01] }}
      >
        <textarea
          ref={textareaRef}
          placeholder="What are your thoughts?"
          className="w-full text-[15px] outline-none overflow-hidden bg-transparent placeholder:text-light font-small resize-none"
          value={commentContent.content}
          onChange={(e) => {
            setCommentContent({ content: e.target.value });
          }}
          onInput={handleInput}
          onFocus={() => setCommentFocused(true)}
        />
      </motion.div>

      {/* comment buttons */}
      <AnimatePresence>
        {commentFocused && (
          <motion.div
            className="flex items-center justify-end gap-2 absolute right-6 bottom-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 5,
              transition: { duration: 0.7, ease: [0, 0.71, 0.2, 1.01] },
            }}
            transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
          >
            <button
              className="text-sm font-mediumPrimary text-darker px-4 bg-lightish hover:bg-light"
              onClick={() => {
                setCommentContent({ content: "" });
                setCommentFocused(false);
              }}
            >
              Cancel
            </button>
            <button
              disabled={!commentContent.content}
              className="text-sm font-mediumPrimary text-lighter px-6 bg-darker hover:bg-darkest disabled:bg-light disabled:cursor-not-allowed"
              onClick={() => {
                handleCreateComment(commentContent);
                setCommentContent({ content: "" });
                setCommentFocused(false);
              }}
            >
              Send
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

CommentForm.propTypes = {
  handleCreateComment: PropTypes.func.isRequired,
};

export default CommentForm;
