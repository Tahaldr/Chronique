import { BiFilterAlt } from 'react-icons/bi';
import { RiNotification3Line } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className='flex flex-col'>
      <div className='bg-red-300 flex items-center justify-end py-3 px-6 gap-3'>
        {/* Search users */}
        <div></div>
        {/* Search button */}
        <div>
          <FiSearch className='text-2xl' />
        </div>
        {/* Reports notifications */}
        <div>
          <RiNotification3Line className='text-2xl' />
        </div>
        {/* Filter users */}
        <div>
          <BiFilterAlt className='text-2xl' />
        </div>
      </div>
      <div className='h-20 bg-blue-300'>2</div>
      <div className='h-10 bg-green-300'>3</div>
    </div>
  );
};

export default AdminDashboard;
