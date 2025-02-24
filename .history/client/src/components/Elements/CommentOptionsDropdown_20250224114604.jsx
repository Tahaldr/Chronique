import { MdOutlineReport } from "react-icons/md";
import { useUserStore } from "../../stores/useUserStore";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";

const CommentOptionsDropdown = ({
  comment,
  CommentDropdownRef,
  setCommentOptionsShow,
  commentOptionsPosition,
  setCommentDeleteConfirm,
}) => {
  const { user } = useUserStore();
  const isAuthor =
    user._id === comment.author._id ||
    user.user?._id === comment.author._id ||
    user.idAdmin ||
    user.user?.idAdmin;

  return (
    <motion.div
      className={`options-dropdown absolute right-0 bg-dark text-lighter p-2 font-bigPrimary text-base z-40 ${
        commentOptionsPosition === "up"
          ? "origin-top top-9"
          : "origin-bottom bottom-9"
      }`}
      ref={CommentDropdownRef}
      initial={{ scaleY: 0 }}
      animate={{
        scaleY: 1,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      exit={{ scaleY: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
      onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up
    >
      {/* Show Edit and Delete buttons if the user is the post author or an admin || button is clicked */}
      {isAuthor && (
        <button
          className="flex place-items-center gap-2 bg-darker hover:bg-red-800 tracking-wide py-1 px-4"
          onClick={() => {
            setCommentDeleteConfirm({
              commentId: comment._id,
              confirming: true,
            });
            setCommentOptionsShow(null);
          }}
        >
          <span>
            <RiDeleteBinLine className="text-lg" />
          </span>
          <p>Delete</p>
        </button>
      )}

      {/* Show Report button if the user is not the post author */}
      {!isAuthor && (
        <button className="flex place-items-center gap-2 bg-darker hover:bg-red-800 tracking-wide py-1 px-4">
          <span>
            <MdOutlineReport className="text-lg" />
          </span>
          <p>Report</p>
        </button>
      )}
    </motion.div>
  );
};

CommentOptionsDropdown.propTypes = {
  comment: PropTypes.object.isRequired,
  CommentDropdownRef: PropTypes.object.isRequired,
  setCommentOptionsShow: PropTypes.func.isRequired,
  commentOptionsPosition: PropTypes.string.isRequired,
  setCommentDeleteConfirm: PropTypes.func.isRequired,
};

export default CommentOptionsDropdown;
