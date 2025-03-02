import PropTypes from "prop-types";
import { useUserStore } from "../../../stores/useUserStore";
import { useRef, useState } from "react";
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
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div
      className="flex flex-col gap-3 w-full border border-light py-3 px-6 overflow-hidden transition-all duration-[3000ms] ease-in-out"
      style={{
        flexDirection: commentFocused ? "column" : "row",
      }}
    >
      {/* user info */}
      <AnimatePresence>
        {commentFocused && (
          <motion.div
            className="flex items-center gap-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              position: "absolute",
              transition: { duration: 0.1, ease: [0, 0.71, 0.2, 1.01] },
            }}
            transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
          >
            <img
              src={user.userPic}
              alt="user profile"
              className="size-7 rounded-full object-cover"
            />
            <p className="font-mediumPrimary text-darker">{user.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* comment input */}
      <motion.div
        className="w-full"
        animate={{ height: commentFocused ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
      >
        <textarea
          ref={textareaRef}
          placeholder="What are your thoughts?"
          className="w-full text-[15px] outline-none overflow-hidden bg-transparent placeholder:text-light font-small resize-none"
          rows={commentFocused ? 3 : 1}
          value={commentContent.content}
          onChange={(e) => {
            setCommentContent({ content: e.target.value });
          }}
          onInput={handleInput}
          onFocus={() => setCommentFocused(true)}
        />
      </motion.div>

      {/* comment buttons */}
      <div className="flex items-center justify-end gap-2">
        <AnimatePresence>
          {commentFocused && (
            <motion.button
              className="text-sm font-mediumPrimary text-darker px-4 bg-lightish hover:bg-light"
              onClick={() => {
                setCommentContent({ content: "" });
                setCommentFocused(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.1, ease: [0, 0.71, 0.2, 1.01] },
              }}
              transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
            >
              Cancel
            </motion.button>
          )}
        </AnimatePresence>
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
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  handleCreateComment: PropTypes.func.isRequired,
};

export default CommentForm;
