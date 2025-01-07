import { FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useUserStore } from "../../stores/useUserStore";
import MarkerCircle from "../MarkerCircle";
import { useEffect, useRef, useState } from "react";
import ProfileDropDown from "../Elements/ProfileDropDown";
import CategoriesCarousel from "./ChronicleComps/CategoriesCarousel";
import Search from "./ChronicleComps/Search";

const HomeNav = ({
  hidden,
  setActive,
  active,
  setActiveCategory,
  activeCategory,
}) => {
  const [hovered, setHovered] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);

  const dropdownRef = useRef(null); // Ref to track the dropdown container

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileClicked(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const { user } = useUserStore();
  const cubicBezierVar = [1, -0.01, 0.7, 1.04];

  return (
    <motion.div
      className="sticky z-50 top-0 border-y border-darkest bg-navBg flex flex-col items-center justify-center"
      variants={{
        hidden: { y: 0 },
        visible: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div
        ref={dropdownRef}
        className="flex items-center justify-center border-darker h-11 list-none gap-6 md:gap-12 w-full text-darkest font-smallBold text-xs lg:text-sm"
      >
        {/* The Chronicle button */}
        <li
          className={`${
            active === "chronicle" ? "text-darkest" : "text-darkish"
          } relative grid place-items-center cursor-pointer`}
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setActive("chronicle")}
        >
          <button>The Chronicle</button>
          <MarkerCircle
            hovered={hovered === 1}
            cubicBezierVar={cubicBezierVar}
            width="110px"
            height="110px"
            strokeWidth=".3"
          />
        </li>
        {/* The About button */}
        <li
          className={`${
            active === "about" ? "text-darkest" : "text-darkish"
          } relative grid place-items-center cursor-pointer`}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setActive("about")}
        >
          <button>About Us</button>
          <MarkerCircle
            hovered={hovered === 2}
            cubicBezierVar={cubicBezierVar}
            width="90px"
            height="90px"
            strokeWidth=".3"
          />
        </li>
        {/* The Admin button */}
        {user && (user.idAdmin || user.user?.idAdmin) && (
          <li
            className={`${
              active === "admin" ? "text-darkest" : "text-darkish"
            } relative grid place-items-center cursor-pointer`}
            onMouseEnter={() => setHovered(3)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive("admin")}
          >
            <button>Admin Dashboard</button>
            <MarkerCircle
              hovered={hovered === 3}
              cubicBezierVar={cubicBezierVar}
              width="140px"
              height="140px"
              strokeWidth=".2"
            />
          </li>
        )}
        {/* The Create Post button */}
        {user && (
          <li>
            <button
              className=" text-lightest font-bigSecondaryItalic py-[.2rem] px-4 relative"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              <span className="absolute w-full h-full bg-dark top-0 left-0 z-[-1]"></span>
              <motion.span
                className="absolute w-full h-full bg-light top-0 left-0 z-[-1] origin-left"
                animate={{ width: btnHovered ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              ></motion.span>
              <div className="flex items-center gap-1 lg:gap-2">
                <FaPlus className="text-xs" />
                <span>Create post</span>
              </div>
            </button>
          </li>
        )}
        {/* The User dropdown */}
        <li className="cursor-pointer">
          {user ? (
            <div
              className="relative"
              onClick={() => setProfileClicked((prev) => !prev)}
            >
              <div
                className="flex place-items-center gap-2 relative"
                onMouseEnter={() => setProfileHovered(true)}
                onMouseLeave={() => setProfileHovered(false)}
              >
                <img
                  src={user.userPic || user.user?.userPic}
                  alt={`{user.name || user.user.name} pic`}
                  className="w-7 h-7 object-cover lg:w-8 lg:h-8 rounded-full lg:flex"
                />
                {profileHovered && (
                  <div className=" absolute w-full h-full rounded-full bg-lightest opacity-10 top-0 left-0"></div>
                )}
              </div>
              {/* Dropdown menu */}
              <AnimatePresence>
                {profileClicked && (
                  <div>
                    <ProfileDropDown id={user.id || user.user?.id} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              className="text-lightest font-bigSecondaryItalic flex place-items-center px-4 h-6 relative"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              <span className="absolute w-full h-full bg-dark top-0 left-0 z-[-1]"></span>

              <motion.span
                className="absolute w-full h-full bg-light top-0 left-0 z-[-1] origin-left"
                animate={{ width: btnHovered ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              ></motion.span>

              <a href="/signup" className="pr-4">
                Sign in
              </a>
              <div className="w-[1px] h-full bg-darker"></div>
              <a href="/login" className="pl-4">
                Log in
              </a>
            </button>
          )}
        </li>
      </div>
      {active === "chronicle" && (
        <div className="flex flex-col md:flex-row h-28 md:h-14 w-full border-t border-darker">
          <CategoriesCarousel
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
          <Search />
        </div>
      )}
    </motion.div>
  );
};

HomeNav.propTypes = {
  hidden: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
  setActiveCategory: PropTypes.func.isRequired,
  activeCategory: PropTypes.string.isRequired,
};

export default HomeNav;
