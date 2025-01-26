import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdKeyboardCommandKey } from "react-icons/md";
import { useRef, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { PostContext } from "../../../App";

const Search = ({
  searchTerm,
  setSearchTerm,
  // searchFinalTerm,
  setSearchFinalTerm,
}) => {
  const inputRef = useRef(null); // Reference to the input element
  const { setSearchSubmitted } = useContext(PostContext);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault(); // Prevent default browser behavior
        inputRef.current?.focus(); // Focus the input field
      }
    };

    window.addEventListener("keydown", handleShortcut);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  // Search posts implementation
  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      setSearchFinalTerm(searchTerm.trim());
      setSearchSubmitted(true);
      setSearchTerm("");
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  return (
    <div className="order-1 md:order-2 w-full md:w-1/3 h-1/2 md:h-14 flex justify-center items-center">
      <div className="flex items-center justify-between bg-lightish w-[90%] h-[67%] px-4 rounded-sm">
        <form
          className="flex items-center h-full w-full"
          onSubmit={handleSearch}
        >
          <button type="submit">
            <FiSearch className="text-xl text-dark hover:text-darker flex-shrink-0" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-full h-full ml-3 mr-7 text-base font-smallMedium text-darkest placeholder:text-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex items-center relative">
          <AnimatePresence mode="wait">
            {searchTerm.length > 0 ? (
              <motion.div
                key="clear-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0"
              >
                <RxCross2
                  className="text-xl text-darkish cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="shortcut-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 flex items-center text-sm text-darkish font-smallMedium"
              >
                <MdKeyboardCommandKey className="text-base" />
                <span className="font-bold text-base ml-[2px]">/</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

Search.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setSearchSubmitted: PropTypes.func.isRequired,
  // searchSubmitted: PropTypes.bool.isRequired,
  // searchFinalTerm: PropTypes.string.isRequired,
  setSearchFinalTerm: PropTypes.func.isRequired,
};

export default Search;
