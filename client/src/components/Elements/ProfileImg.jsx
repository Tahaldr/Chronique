import { AnimatePresence } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import ProfileDropDown from "./ProfileDropDown";
import { useEffect, useRef, useState } from "react";
import PropsType from "prop-types";

const ProfileImg = ({ type }) => {
  const [profileClicked, setProfileClicked] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const { user } = useUserStore();

  const dropdownRef = useRef(null); // Ref to track the dropdown container

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileClicked(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [setProfileClicked, dropdownRef]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onClick={() => setProfileClicked((prev) => !prev)}
    >
      <div
        className="flex place-items-center relative"
        onMouseEnter={() => setProfileHovered(true)}
        onMouseLeave={() => setProfileHovered(false)}
      >
        <img
          src={user.userPic || user.user?.userPic}
          alt={`{user.name || user.user.name} pic`}
          className={`
            ${type === "home" ? " size-7 lg:size-8" : " size-8 lg:size-9"}
            object-cover rounded-full lg:flex`}
        />
        {profileHovered && (
          <div className=" absolute w-full h-full rounded-full bg-lightest opacity-10 top-0 left-0"></div>
        )}
      </div>
      {/* Dropdown menu */}
      <AnimatePresence>
        {profileClicked && (
          <div className="relative">
            <ProfileDropDown id={user.id || user.user?.id} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

ProfileImg.propTypes = {
  type: PropsType.string.isRequired,
};

export default ProfileImg;
