import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdKeyboardCommandKey } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null); // Reference to the input element

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

  return (
    <div className="order-1 md:order-2 w-full md:w-1/3 h-1/2 md:h-14 flex justify-center items-center">
      <div className="flex items-center justify-between bg-lightish w-[90%] h-[67%] px-4 rounded-sm">
        <FiSearch className="text-xl text-dark hover:text-darker flex-shrink-0" />
        <input
          ref={inputRef} // Attach the ref to the input element
          type="text"
          placeholder="Search"
          className="bg-transparent focus:outline-none w-full h-full mx-3 text-base font-smallMedium text-darkest placeholder:text-dark"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center relative">
          <AnimatePresence mode="wait">
            {searchValue.length > 0 ? (
              <motion.div
                key="clear-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0"
              >
                <RxCross2
                  className="text-xl text-dark cursor-pointer"
                  onClick={() => setSearchValue("")}
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

export default Search;
