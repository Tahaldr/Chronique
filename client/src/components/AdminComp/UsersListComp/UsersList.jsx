import { Fragment, useContext, useEffect, useState } from 'react';
import Usercard from './Usercard';
import Tooltip from '../../Elements/Tooltip';
import { useUserStore } from '../../../stores/useUserStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AdminDashboardContext } from '../../../App';
import { useInView } from 'react-intersection-observer';
import Loading from '../../Loading';
import showToast from '../../Toast';

const UsersList = () => {
  const [userSelected, setUserSelected] = useState(null);
  const { usersSearch_Submitted, usersSearch_FinalTerm, filterUsers } =
    useContext(AdminDashboardContext);
  const { getAllUsers, getOnlyUsers, getOnlyAdmins, searchUsers } = useUserStore();
  const { ref, inView } = useInView();

  // Fetch users using infinite query
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['users', usersSearch_Submitted, usersSearch_FinalTerm, filterUsers],
    queryFn: ({ pageParam = 1 }) => {
      if (usersSearch_Submitted && usersSearch_FinalTerm) {
        return searchUsers(usersSearch_FinalTerm, pageParam);
      } else if (filterUsers === 'admins') {
        return getOnlyAdmins(pageParam);
      } else if (filterUsers === 'users') {
        return getOnlyUsers(pageParam);
      } else {
        return getAllUsers(pageParam);
      }
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1;
      }
      return null;
    },
  });
  console.log('data : ', data);

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isError) {
    showToast({ message: error.message, type: 'error' });
  }

  return (
    <div className='w-full px-0 md:px-6 py-3'>
      <div className='w-full'>
        <table className='w-full text-sm text-left table-fixed'>
          <thead className='font-mediumPrimary bg-lightish text-dark'>
            {/* Table Header */}
            <tr>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Email
              </th>
              <th scope='col' className='px-6 py-3'>
                Votes
              </th>
              <th scope='col' className='px-6 py-3'>
                isAdmin
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className='px-6 py-10'>
                  <div className='flex items-center justify-center'>
                    <Loading size='3xl' color='dark' />
                  </div>
                </td>
              </tr>
            ) : (
              <Fragment>
                {data?.pages && data.pages[0].users.length > 0 ? (
                  data?.pages.map((group, i) => (
                    <Fragment key={i}>
                      {group.users.map((user) => (
                        <Fragment key={user._id}>
                          <tr
                            className={`border-b border-light text-darker font-smallMedium cursor-pointer ${
                              userSelected === user._id
                                ? 'border-opacity-100'
                                : 'border-opacity-30 hover:border-opacity-100'
                            }`}
                            onClick={() => {
                              userSelected === user._id
                                ? setUserSelected(null)
                                : setUserSelected(user._id);
                            }}>
                            {/* Name */}
                            <td scope='row' className='px-6 py-3'>
                              <Tooltip text={user._id}>
                                <p className='w-full h-full'>{user.name}</p>
                              </Tooltip>
                            </td>
                            {/* Email */}
                            <td scope='row' className='px-6 py-3'>
                              {user.email}
                            </td>
                            {/* Votes */}
                            <td scope='row' className='px-6 py-3'>
                              {user.votes}
                            </td>
                            {/* isAdmin */}
                            <td
                              scope='row'
                              className={`px-6 py-3 ${
                                user.idAdmin ? 'font-smallBoldItalic text-darkest' : ''
                              } `}>
                              {user.idAdmin ? 'true' : 'false'}
                            </td>
                          </tr>
                          {/* User card */}
                          {userSelected === user._id && <Usercard user={user} />}
                        </Fragment>
                      ))}
                    </Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-6 py-6 text-center font-mediumPrimary text-base text-dark'>
                      No users found
                    </td>
                  </tr>
                )}

                {isFetching && isFetchingNextPage && (
                  <tr>
                    <td colSpan={4} className='px-6 py-10'>
                      <div className='flex items-center justify-center'>
                        <Loading size='3xl' color='dark' />
                      </div>
                    </td>
                  </tr>
                )}

                <tr ref={ref} className='h-20'>
                  <td colSpan={4}></td>
                </tr>
              </Fragment>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
