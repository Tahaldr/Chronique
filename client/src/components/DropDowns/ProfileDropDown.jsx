import { GoPerson } from "react-icons/go";
import { BiLogOutCircle } from "react-icons/bi";
import { useUserStore } from "../../stores/useUserStore";
import { motion } from "framer-motion";

const ProfileDropDown = () => {
  const { logout } = useUserStore();

  return (
    <motion.div
      className="absolute right-0 top-11 flex flex-col gap-2 bg-dark text-lighter p-2 font-bigPrimary text-base origin-top "
      initial={{ scaleY: 0 }}
      animate={{
        scaleY: 1,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      exit={{ scaleY: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
    >
      <a
        href="/profile"
        className="flex place-items-center gap-2 bg-darker hover:bg-darkest tracking-widest py-1 px-4"
      >
        <span>
          <GoPerson className="text-lg" />
        </span>
        <p>Profile</p>
      </a>
      <button
        onClick={() => logout()}
        className="flex place-items-center gap-2 bg-darker hover:bg-red-800 tracking-wide py-1 px-4"
      >
        <span>
          <BiLogOutCircle className="text-lg" />
        </span>
        <p>Logout</p>
      </button>
    </motion.div>
  );
};

export default ProfileDropDown;
