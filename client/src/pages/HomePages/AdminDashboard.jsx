import { useContext } from 'react';
import { AdminDashboardContext } from '../../App';
import AdminHeader from '../../components/AdminComp/AdminHeader';
import AdminStats from '../../components/AdminComp/AdminStats';
import Report from '../../components/AdminComp/Report';
import { AnimatePresence } from 'framer-motion';
import UsersList from '../../components/AdminComp/UsersListComp/UsersList';
import ArrowScrollUp from '../../components/Elements/ArrowScrollUp';

const AdminDashboard = () => {
  const { usersSearch_Term, setUsersSearch_Term, setUsersSearch_FinalTerm, reportSelected } =
    useContext(AdminDashboardContext);

  return (
    <>
      <ArrowScrollUp type='fixed' />
      {reportSelected && (
        <AnimatePresence>
          <Report />
        </AnimatePresence>
      )}
      <div className='flex flex-col'>
        {/* Header */}
        <AdminHeader
          usersSearch_Term={usersSearch_Term}
          setUsersSearch_Term={setUsersSearch_Term}
          setUsersSearch_FinalTerm={setUsersSearch_FinalTerm}
        />
        {/* Stats */}
        <div className='z-0'>
          <AdminStats />
        </div>
        {/* Users list */}
        <div className='w-full'>
          <UsersList />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
