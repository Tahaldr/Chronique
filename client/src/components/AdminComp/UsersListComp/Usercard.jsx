import moment from 'moment';
import PropTypes from 'prop-types';
import { MdShield } from 'react-icons/md';

const Usercard = ({ user }) => {
  return (
    <tr className='border-b border-lightish bg-lightish'>
      <td colSpan={4} className='px-6 py-3 w-full'>
        <div className='flex w-full'>
          {/* User Pic */}
          <div className='w-2/6 sm:w-1/6'>
            <div className='h-fit w-fit relative'>
              <img
                src={user.userPic}
                alt={user.name}
                className='size-16 md:size-20 rounded-full object-cover'
              />
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
                <p className='text-xs sm:text-sm font-smallMedium bg-light bg-opacity-50 hover:bg-opacity-70 text-dark w-fit px-5 mb-1'>
                  {user._id}
                </p>
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
              {/* Created At */}
              <p>Since {moment(user.createdAt).format('dddd D, YYYY')}</p>
              {/* Updated At */}
              <p>Updated at {moment(user.updatedAt).format('dddd D, YYYY')}</p>
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
