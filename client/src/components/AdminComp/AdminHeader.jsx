import { useState } from 'react';
import { BiFilterAlt } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { RiNotification3Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { MdKeyboardCommandKey } from 'react-icons/md';
import Search from '../Elements/Search';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

const AdminHeader = ({ usersSearch_Term, setUsersSearch_Term, setUsersSearch_FinalTerm }) => {
  const [searchToggled, setSearchToggled] = useState(false);
  return (
    <div className='w-full flex flex-col items-center sm:flex-row h-16 px-10 md:px-6 gap-5'>
      {/* Buttons */}
      <div className='flex items-center gap-3 text-darkest'>
        {/* Filter btn */}
        <div>
          <BiFilterAlt className='text-xl' />
        </div>

        {/* Report btn */}
        <div>
          <RiNotification3Line className='text-xl' />
        </div>

        {/* Search btn */}

        <div
          className={`flex items-center justify-center gap-3 px-3 h-9 rounded-sm transition-colors duration-500 ease-in-out ${
            searchToggled ? 'bg-darkish text-lightest' : 'bg-lightish'
          }`}>
          {searchToggled ? (
            <div
              onClick={() => {
                setUsersSearch_Term('');
                setSearchToggled(!searchToggled);
              }}>
              <RxCross2 className='text-xl' />
            </div>
          ) : (
            <div onClick={() => setSearchToggled(!searchToggled)}>
              <FiSearch className='text-xl' />
            </div>
          )}
          <div>
            <div
              className={`flex items-center text-sm font-smallMedium transition-colors duration-500 ease-in-out ${
                searchToggled ? 'text-lightish' : 'text-darkish'
              }`}>
              <MdKeyboardCommandKey className='text-base' />
              <span className='font-bold text-base ml-[2px]'>/</span>
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
