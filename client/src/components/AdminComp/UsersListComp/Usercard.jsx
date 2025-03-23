import moment from 'moment';
import PropTypes from 'prop-types';
import { MdShield } from 'react-icons/md';
import MarkerCircle from '../../MarkerCircle';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Usercard = ({ user }) => {
  const [timeHovered, setTimeHovered] = useState(null);
  const [imgHovered, setImgHovered] = useState(null);

  return (
    <tr className='border-b border-lightish bg-lightish'>
      <td colSpan={4} className='px-6 py-3 w-full'>
        <div className='flex w-full'>
          {/* User Pic */}
          <div className='w-2/6 sm:w-1/6'>
            <div className='h-fit w-fit relative'>
              <Link
                to={`/profile/${user._id}`}
                className='relative'
                onMouseEnter={() => setImgHovered(user._id)}
                onMouseLeave={() => setImgHovered(null)}>
                <img
                  src={user.userPic}
                  alt={user.name}
                  className='size-16 md:size-20 rounded-full object-cover'
                />
                <AnimatePresence>
                  {imgHovered === user._id && (
                    <motion.div
                      className='size-16 md:size-20 rounded-full bg-lightest bg-opacity-20 absolute top-0 left-0'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.18, 0.69, 0.5, 0.72] }}
                    />
                  )}
                </AnimatePresence>
              </Link>
              {user.idAdmin && (
                <MdShield className='text-dark text-xl sm:text-2xl absolute bottom-0 right-0' />
              )}
            </div>
          </div>
          {/* User Info */}
          <div className='w-full flex justify-between gap-2'>
            <div
              className='font-mediumPrimary text-base sm:text-lg text-darker border-l border-light pl-5
            flex flex-col gap-3
            '>
              {/* User Details */}
              <div>
                {/* User ID */}
                <Link
                  to={`/profile/${user._id}`}
                  className='text-xs sm:text-sm font-smallMedium bg-light bg-opacity-50 hover:bg-opacity-70
                 text-dark w-fit px-5 mb-1 transition-colors duration-300 ease-in-out cursor-pointer'>
                  {user._id}
                </Link>
                {/* Name */}
                <p>{user.name}</p>
                {/* Email */}
                <p>{user.email}</p>
              </div>
              {/* User Stats */}
              <div className='text-sm sm:text-base text-dark'>
                {/* Votes */}
                <p>Votes total : {user.votes}</p>
                {/* posts */}
                <p>Posts total : {user.postCount}</p>
              </div>
            </div>
            <div className='font-smallMediumItalic text-darkish flex flex-col justify-end text-xs sm:text-sm'>
              <div
                className='relative'
                onMouseEnter={() => setTimeHovered(user._id)}
                onMouseLeave={() => setTimeHovered(null)}>
                <div className='w-fit h-fit'>
                  {/* Created At */}
                  <p>Since {moment(user.createdAt).format('dddd D, YYYY')}</p>
                  {/* Updated At */}
                  <p>Updated at {moment(user.updatedAt).format('dddd D, YYYY')}</p>
                </div>
                <MarkerCircle
                  hovered={timeHovered === user._id}
                  cubicBezierVar={[0.25, 0.1, 0.25, 1]}
                  width={'200px'}
                  height={'200px'}
                  strokeWidth={'.1'}
                />
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

Usercard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Usercard;
