import moment from 'moment';
import { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReportStore } from '../../stores/useReportStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import showToast from '../Toast';
import Loading from '../Loading';
import { AdminDashboardContext } from '../../App';

const AdminsReports = () => {
  const { setReportSelected, setReportsToggled } = useContext(AdminDashboardContext);
  const reportsRef = useRef(null);
  const {
    getAllReports,
    // loading
  } = useReportStore();
  const { ref, inView } = useInView();

  // Get all reports
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    // isFetchingNextPage,
    // isFetching,
  } = useInfiniteQuery({
    queryKey: ['reports'],
    queryFn: ({ pageParam = 1 }) => {
      return getAllReports(10, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return null;
    },
  });
  // console.log('data', data);

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  // Handle click outside
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

  // Handle infinite scroll error
  if (isError) {
    showToast({ message: error.message, type: 'error' });
  }

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
      <div className='w-80 sm:w-96 h-[256px] overflow-y-scroll reportScroll'>
        {isLoading ? (
          <div className='flex items-center justify-center h-full'>
            <Loading size='4xl' color='darkish' />
          </div>
        ) : (
          <>
            {data?.pages && data.pages[0].reports.length > 0 ? (
              <div>
                {data?.pages.map((group, i) => (
                  <div key={i}>
                    {group.reports.map((report, index) => (
                      <div
                        key={index}
                        className='cursor-pointer flex items-center justify-start w-full gap-5 bg-darker hover:bg-darkest py-1 px-4 whitespace-nowrap'
                        onClick={() => {
                          setReportSelected(report);
                          setReportsToggled(false);
                        }}>
                        <p className='font-small text-lighter text-sm sm:text-base w-[75%] truncate'>
                          {report.description}
                        </p>
                        <p className='font-smallItalic text-light text-xs sm:text-sm w-[25%] flex justify-end'>
                          {moment(report.createdAt).fromNow()}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <p className='font-small text-lighter'>No reports found</p>
              </div>
            )}

            <div ref={ref} className='h-10'></div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AdminsReports;
