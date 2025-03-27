import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useUserStore } from "../../stores/useUserStore";
import MarkerCircle from "../MarkerCircle";
import { useContext, useState } from "react";
import CategoriesCarousel from "./ChronicleComps/CategoriesCarousel";
import Search from "../Elements/Search";
import { Link, useNavigate } from "react-router-dom";
import ProfileImg from "../Elements/ProfileImg";
import { AdminDashboardContext } from "../../App";

const HomeNav = ({
  hidden,
  setActive,
  active,
  setActiveCategory,
  activeCategory,
  setSearchTerm,
  searchTerm,
  setSearchFinalTerm,
  // searchSubmitted,
  // searchFinalTerm,
}) => {
  const [hovered, setHovered] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const { setUsersSearch_FinalTerm, setUsersSearch_Submitted, setFilterUsers } =
    useContext(AdminDashboardContext);

  const { user } = useUserStore();
  const cubicBezierVar = [1, -0.01, 0.7, 1.04];

  const navigate = useNavigate();

  return (
    <motion.div
      className="sticky z-[55] top-0 border-y border-darkish bg-navBg flex flex-col items-center justify-center"
      variants={{
        hidden: { y: 0 },
        visible: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between px-4 border-darker h-11 list-none gap-6 md:gap-12 w-full text-darkest font-smallBold text-xs lg:text-sm">
        {/* Left side */}
        <div className="flex items-center justify-center gap-7">
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

          {/* The Admin button */}
          {user && (user.idAdmin || user.user?.idAdmin) && (
            <li
              className={`${
                active === "admin" ? "text-darkest" : "text-darkish"
              } relative grid place-items-center cursor-pointer`}
              onMouseEnter={() => setHovered(2)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setUsersSearch_FinalTerm("");
                setUsersSearch_Submitted(false);
                setFilterUsers("all");
                setActive("admin");
              }}
            >
              <button>Admin Dashboard</button>
              <MarkerCircle
                hovered={hovered === 2}
                cubicBezierVar={cubicBezierVar}
                width="140px"
                height="140px"
                strokeWidth=".2"
              />
            </li>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-center gap-7">
          {/* The Create Post button */}
          {user && (
            <li>
              <button
                className=" text-lightest font-bigSecondaryItalic py-[.2rem] px-4 relative"
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                onClick={() => navigate("/create/null")}
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
              <ProfileImg type="home" />
            ) : (
              // Sign in and log in buttons
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

                {/* signup btn */}
                <Link to="/signup" className="pr-4">
                  Sign in
                </Link>
                {/* line divider */}
                <div
                  className={`w-[1px] h-full bg-darker transition-colors duration-300 ${
                    btnHovered ? "bg-darkish" : ""
                  }`}
                ></div>
                {/* login btn */}
                <Link to="/login" className="pl-4">
                  Log in
                </Link>
              </button>
            )}
          </li>
        </div>
      </div>

      {/* Chronicle bottom navbar */}
      {active === "chronicle" && (
        <div className="flex flex-col md:flex-row h-28 md:h-14 w-full border-t border-darkish">
          <CategoriesCarousel
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
            setSearchFinalTerm={setSearchFinalTerm}
          />
          <Search
            type="chronicle"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSearchFinalTerm={setSearchFinalTerm}
          />
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
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setSearchFinalTerm: PropTypes.func.isRequired,
};

export default HomeNav;
