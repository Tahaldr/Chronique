import PropTypes from 'prop-types';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AdminsReports = ({ reports, setReportsToggled }) => {
  const reportsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is on the button, do nothing
      if (event.target.closest('.reports-btn')) return;

      if (reportsRef.current && !reportsRef.current.contains(event.target)) {
        setReportsToggled(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setReportsToggled]);

  return (
    <motion.div
      ref={reportsRef}
      className='absolute left-0 mt-3 bg-dark text-lighter p-2 text-base z-40 origin-top overflow-hidden'
      initial={{ scaleY: 0 }}
      animate={{
        scaleY: 1,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      exit={{ scaleY: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
      onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up
    >
      <div className='w-full h-[256px] overflow-y-scroll reportScroll'>
        {reports.map((report, index) => (
          <div
            key={index}
            className='flex items-center justify-start w-full gap-4 bg-darker hover:bg-darkest py-1 px-4 whitespace-nowrap'>
            <p className='font-small text-lighter w-52 truncate'>{report.description}</p>
            <p className='font-smallItalic text-light text-sm'>
              {moment(report.createdAt).fromNow()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

AdminsReports.propTypes = {
  reports: PropTypes.array.isRequired,
  setReportsToggled: PropTypes.func.isRequired,
};

export default AdminsReports;
