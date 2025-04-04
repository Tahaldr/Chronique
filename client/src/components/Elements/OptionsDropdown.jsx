import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineReport } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AdminDashboardContext } from "../../App";

const OptionsDropdown = ({
  user,
  postId,
  postAuthor,
  setOptionsShow,
  optionsPosition,
  setDeleteConfirm,
}) => {
  const navigate = useNavigate();
  const { setReportFormShow } = useContext(AdminDashboardContext);

  const isAuthor =
    user._id === postAuthor._id ||
    user.user?._id === postAuthor._id ||
    user.idAdmin ||
    user.user?.idAdmin;

  const isAuthorOfPost =
    user._id === postAuthor._id || user.user?._id === postAuthor._id;

  return (
    <motion.div
      className={`options-dropdown absolute right-0 flex flex-col gap-2 bg-dark text-lighter p-2 font-bigPrimary text-base z-40 ${
        optionsPosition === "up" ? "origin-top top-9" : "origin-bottom bottom-9"
      }`}
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
        <>
          <button
            disabled={!isAuthorOfPost}
            className="flex place-items-center gap-2 bg-darker hover:bg-darkest tracking-widest py-1 px-4
            disabled:opacity-50"
            onClick={() => navigate(`/create/${postId}`)}
          >
            <span>
              <BiEditAlt className="text-lg" />
            </span>
            <p>Edit</p>
          </button>
          <button
            className="flex place-items-center gap-2 bg-darker hover:bg-red-800 tracking-wide py-1 px-4"
            onClick={() => {
              setDeleteConfirm({
                postId: postId,
                confirming: true,
              });
              setOptionsShow(null);
            }}
          >
            <span>
              <RiDeleteBinLine className="text-lg" />
            </span>
            <p>Delete</p>
          </button>
        </>
      )}

      {/* Show Report button if the user is not the post author */}
      {!isAuthor && (
        <button
          className="flex place-items-center gap-2 bg-darker hover:bg-red-800 tracking-wide py-1 px-4"
          onClick={() => {
            setReportFormShow({
              type: "post",
              post: postId,
              comment: "",
              isVisible: true,
            });
            setOptionsShow(null);
          }}
        >
          <span>
            <MdOutlineReport className="text-lg" />
          </span>
          <p>Report</p>
        </button>
      )}
    </motion.div>
  );
};

OptionsDropdown.propTypes = {
  user: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  postAuthor: PropTypes.object.isRequired,
  setOptionsShow: PropTypes.func.isRequired,
  optionsPosition: PropTypes.string.isRequired,
  setDeleteConfirm: PropTypes.func.isRequired,
};

export default OptionsDropdown;
