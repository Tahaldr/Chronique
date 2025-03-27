import { motion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import { AdminDashboardContext } from '../../App';
import PropTypes from 'prop-types';

const FilterDropdown = ({ setFilterClicked }) => {
  const {
    // filterUsers,
    setFilterUsers,
    setUsersSearch_FinalTerm,
    setUsersSearch_Submitted,
  } = useContext(AdminDashboardContext);
  const filterRef = useRef(null);
  const filters = [
    {
      title: 'All',
      value: 'all',
    },
    {
      title: 'Only users',
      value: 'users',
    },
    {
      title: 'Only admins',
      value: 'admins',
    },
  ];

  // Handle clicks outside comment dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is on the button, do nothing
      if (event.target.closest('.filter-btn')) return;

      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setFilterClicked]);

  return (
    <motion.div
      className='absolute left-0 mt-3 bg-dark text-lighter p-2 font-bigPrimary text-base z-40 origin-top'
      ref={filterRef}
      initial={{ scaleY: 0 }}
      animate={{
        scaleY: 1,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      exit={{ scaleY: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
      onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up
    >
      <div className='flex flex-col items-center justify-center gap-1'>
        {filters.map((filter, index) => (
          <button
            key={index}
            className='flex items-center justify-start w-full gap-2 bg-darker hover:bg-darkest tracking-wide py-1 px-4 whitespace-nowrap'
            onClick={() => {
              setUsersSearch_FinalTerm('');
              setUsersSearch_Submitted(false);
              setFilterUsers(filter.value);
              setFilterClicked(false);
            }}>
            {filter.title}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

FilterDropdown.propTypes = {
  setFilterClicked: PropTypes.func.isRequired,
};

export default FilterDropdown;
