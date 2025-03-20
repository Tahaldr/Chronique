import { useEffect, useRef, useState } from 'react';
import { BiFilterAlt } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { RiNotification3Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { MdKeyboardCommandKey } from 'react-icons/md';
import Search from '../Elements/Search';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import FilterDropdown from '../Elements/FilterDropdown';
import AdminsReports from './AdminsReports';

const AdminHeader = ({ usersSearch_Term, setUsersSearch_Term, setUsersSearch_FinalTerm }) => {
  const [searchToggled, setSearchToggled] = useState(false);
  const [reportsToggled, setReportsToggled] = useState(false);
  const [filterClicked, setFilterClicked] = useState(false);
  const searchToggleRef = useRef(null); // Hold reference to search toggle button

  // Click the search toggle btn shortcut (CTRL + k)
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault(); // Prevent default browser behavior
        searchToggleRef.current?.click(); // Click the search toggle button
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-start sm:items-center sm:flex-row h-auto sm:h-16 px-10 md:px-6 py-3 sm:py-0 ${
        searchToggled ? 'gap-5' : 'gap-0'
      }`}>
      {/* Buttons */}
      <div className='flex items-center gap-3 text-darkest'>
        {/* Filter btn */}
        <div onClick={() => setFilterClicked(!filterClicked)} className='relative'>
          <BiFilterAlt className='text-xl hover:text-light filter-btn' />

          {/* Filter menu */}
          <AnimatePresence>
            {filterClicked && <FilterDropdown setFilterClicked={setFilterClicked} />}
          </AnimatePresence>
        </div>

        {/* Report btn */}
        <div className='relative'>
          <RiNotification3Line
            className='text-xl hover:text-light reports-btn'
            onClick={() => setReportsToggled(!reportsToggled)}
          />

          {/* Report menu */}
          <AnimatePresence>
            {reportsToggled && <AdminsReports setReportsToggled={setReportsToggled} />}
          </AnimatePresence>
        </div>

        {/* Toggle search btn */}
        <div
          className={`flex items-center justify-center gap-3 px-3 h-9 rounded-sm transition-colors duration-500 ease-in-out ${
            searchToggled ? 'bg-darkish text-lightest' : 'bg-lightish'
          }`}>
          <AnimatePresence mode='wait'>
            {searchToggled ? (
              <motion.div
                key='close'
                ref={searchToggleRef} // Set ref here
                initial={{ rotate: -360, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 360, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                onClick={() => {
                  setUsersSearch_Term('');
                  setSearchToggled(false);
                }}>
                <RxCross2 className='text-xl hover:text-light' />
              </motion.div>
            ) : (
              <motion.div
                key='search'
                ref={searchToggleRef} // Set ref here
                initial={{ rotate: -360, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 360, scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                onClick={() => setSearchToggled(true)}>
                <FiSearch className='text-xl hover:text-light' />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <div
              className={`flex items-center text-sm font-smallMedium transition-colors duration-500 ease-in-out ${
                searchToggled ? 'text-lightish' : 'text-darkish'
              }`}>
              <MdKeyboardCommandKey className='text-base' />
              <span className='font-medium text-base ml-[2px]'>k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search users */}
      <div className='overflow-hidden w-full'>
        <AnimatePresence>
          {searchToggled && (
            <motion.div
              className='w-full'
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}>
              <Search
                type='admin'
                searchTerm={usersSearch_Term}
                setSearchTerm={setUsersSearch_Term}
                setSearchFinalTerm={setUsersSearch_FinalTerm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

AdminHeader.propTypes = {
  usersSearch_Term: PropTypes.string.isRequired,
  setUsersSearch_Term: PropTypes.func.isRequired,
  setUsersSearch_FinalTerm: PropTypes.func.isRequired,
};

export default AdminHeader;
