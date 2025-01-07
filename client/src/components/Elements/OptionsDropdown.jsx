import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineReport } from "react-icons/md";

const OptionsDropdown = ({ user, postId, postAuthor, optionsPosition }) => {
  const isAuthor =
    user._id === postAuthor._id || user.user?._id === postAuthor._id;

  return (
    <motion.div
      className={`options-dropdown absolute right-0 flex flex-col gap-2 bg-dark text-lighter p-2 font-bigPrimary text-base z-20 ${
        optionsPosition === "up" ? "origin-top top-9" : "origin-bottom bottom-9"
      }`}
      initial={{ scaleY: 0 }}
      animate={{
        scaleY: 1,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      exit={{ scaleY: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
    >
      {/* Show Edit and Delete buttons if the user is the post author */}
      {isAuthor && (
        <>
          <button className="flex place-items-center gap-2 bg-darker hover:bg-darkest tracking-widest py-1 px-4">
            <span>
              <BiEditAlt className="text-lg" />
            </span>
            <p>Edit</p>
          </button>
          <button className="flex place-items-center gap-2 bg-darker hover:bg-red-800 tracking-wide py-1 px-4">
            <span>
              <RiDeleteBinLine className="text-lg" />
            </span>
            <p>Delete</p>
          </button>
        </>
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

OptionsDropdown.propTypes = {
  user: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  postAuthor: PropTypes.object.isRequired,
  optionsPosition: PropTypes.string.isRequired,
};

export default OptionsDropdown;
