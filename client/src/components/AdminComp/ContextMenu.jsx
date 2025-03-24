import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
// import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";

import { useContext, useEffect, useRef } from "react";
import { AdminDashboardContext } from "../../App";
import Tooltip from "../Elements/Tooltip";
import PropTypes from "prop-types";
import showToast from "../Toast";
import { motion } from "framer-motion";

const ContextMenu = ({ user }) => {
  const menuRef = useRef();
  const { setShowContextMenu, contextMenuPoints } = useContext(
    AdminDashboardContext
  );

  // Handle copy user function
  const handleCopyUser = (user) => {
    const userInfo = JSON.stringify(user, null, 2);

    navigator.clipboard
      .writeText(userInfo)
      .then(() =>
        showToast({ message: "User copied to clipboard!", type: "success" })
      )
      .catch(() =>
        showToast({ message: "Failed to copy user.", type: "error" })
      );
  };

  // Handle email user function
  const handleEmailUser = (user) => {
    const { email, name } = user;
    const subject = `Chronique stuff - [ Your Subject Here ]`;
    const body = `Hello ${name},\n\nI just wanted to inform you about ...\n\nBest regards,`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const handleUpgradeUser = (user) => {};

  const handleBanUser = (user) => {};

  const data = [
    {
      id: 1,
      text: "Copy",
      icon: <DocumentDuplicateIcon className="size-5" />,
      func: () => {
        handleCopyUser(user), setShowContextMenu(false);
      },
    },
    {
      id: 2,
      text: "Email",
      icon: <AtSymbolIcon className="size-5" />,
      func: () => {
        handleEmailUser(user), setShowContextMenu(false);
      },
    },
    {
      id: 3,
      text: "Upgrade",
      icon: <ChevronDoubleUpIcon className="size-5" />,
      func: () => {
        handleUpgradeUser(user), setShowContextMenu(false);
      },
    },
    {
      id: 4,
      text: "Ban",
      icon: <TrashIcon className="size-5" />,
      func: () => {
        handleBanUser(user), setShowContextMenu(false);
      },
    },
  ];

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setShowContextMenu]);

  // Close context menu on scroll
  useEffect(() => {
    const handleScroll = () => setShowContextMenu(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setShowContextMenu]);

  return (
    <motion.div
      ref={menuRef}
      className="fixed border border-light p-1 bg-lightish flex items-center justify-between gap-1 shadow-sm shadow-light
      transition-colors duration-300 ease-in-out z-50"
      style={{
        top: `${contextMenuPoints.y}px`,
        left: `${contextMenuPoints.x}px`,
      }}
      initial={{ opacity: 0, scale: 0.7, x: -30 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      {data.map((item) => (
        <div
          key={item.id}
          className="hover:bg-light hover:bg-opacity-50 cursor-pointer p-2 flex items-center justify-center"
          onClick={item.func}
        >
          <Tooltip text={item.text}>
            <span className="text-dark hover:text-darkest transition-colors duration-300 ease-in-out">
              {item.icon}
            </span>
          </Tooltip>
        </div>
      ))}
    </motion.div>
  );
};

ContextMenu.propTypes = {
  user: PropTypes.object,
};

export default ContextMenu;
