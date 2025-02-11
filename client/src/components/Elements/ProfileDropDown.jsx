import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { useUserStore } from "../../stores/useUserStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProfileDropDown = () => {
  const { logout } = useUserStore();

  return (
    <motion.div
      className="absolute right-0 top-2 flex flex-col gap-2 bg-dark text-lighter p-2 font-bigPrimary text-base origin-top z-50 "
      initial={{ scaleY: 0 }}
      animate={{
        scaleY: 1,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      exit={{ scaleY: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
      onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up
    >
      <Link
        to={`/profile/${useUserStore.getState().user?._id}`}
        className="flex justify-center items-center gap-3 bg-darker hover:bg-darkest tracking-widest py-1 px-4"
      >
        <span>
          <MdOutlinePerson className="text-lg" />
        </span>
        <p>PROFILE</p>
      </Link>
      <button
        onClick={() => logout()}
        className="flex justify-center items-center gap-3 bg-darker hover:bg-red-800 tracking-wide py-1 px-4"
      >
        <span>
          <MdOutlineLogout className="" />
        </span>
        <p>LOGOUT</p>
      </button>
    </motion.div>
  );
};

export default ProfileDropDown;
