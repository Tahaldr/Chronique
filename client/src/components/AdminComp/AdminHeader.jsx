import { BiFilterAlt } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { RiNotification3Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import Search from '../Elements/Search';
import PropTypes from 'prop-types';

const AdminHeader = ({ usersSearch_Term, setUsersSearch_Term, setUsersSearch_FinalTerm }) => {
  return (
    <div className='w-full flex flex-col sm:flex-row py-3 px-10 md:px-6 gap-3'>
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
        <div>
          <FiSearch className='text-xl' />
        </div>
      </div>

      {/* Search users */}
      <div className='w-full'>
        <Search
          type='admin'
          searchTerm={usersSearch_Term}
          setSearchTerm={setUsersSearch_Term}
          setSearchFinalTerm={setUsersSearch_FinalTerm}
        />
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
