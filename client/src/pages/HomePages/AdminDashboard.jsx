import { useContext } from 'react';
import { AdminDashboardContext } from '../../App';
import AdminHeader from '../../components/AdminComp/AdminHeader';
import AdminStats from '../../components/AdminComp/AdminStats';
import Report from '../../components/AdminComp/Report';
import { AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const {
    usersSearch_Term,
    setUsersSearch_Term,
    usersSearch_FinalTerm,
    setUsersSearch_FinalTerm,
    usersSearch_Submitted,
    setUsersSearch_Submitted,
    reportSelected,
  } = useContext(AdminDashboardContext);

  return (
    <>
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
        <div className='h-10 bg-green-300'>3</div>
      </div>
    </>
  );
};

export default AdminDashboard;
