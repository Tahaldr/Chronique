import { Fragment, useContext, useEffect, useState } from 'react';
import Usercard from './Usercard';
import Tooltip from '../../Elements/Tooltip';
import { useUserStore } from '../../../stores/useUserStore';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AdminDashboardContext } from '../../../App';
import { useInView } from 'react-intersection-observer';
import Loading from '../../Loading';
import showToast from '../../Toast';
import ContextMenu from '../ContextMenu';
import { AnimatePresence } from 'framer-motion';

const UsersList = () => {
  const [userSelected, setUserSelected] = useState(null);
  const {
    usersSearch_Submitted,
    usersSearch_FinalTerm,
    filterUsers,
    setShowContextMenu,
    showContextMenu,
    setContextMenuPoints,
    contextMenuUser,
    setContextMenuUser,
  } = useContext(AdminDashboardContext);
  const { getAllUsers, getOnlyUsers, getOnlyAdmins, searchUsers, makeAdmin, deleteUser, user } =
    useUserStore();
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

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
  // console.log("data : ", data);

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleToggleAdmin = async (userId) => {
    try {
      const ownerId = '67e1e4243797128f37393189';

      if (userId === ownerId) {
        return showToast({
          message: "You cannot change the server owner's admin status.",
          type: 'error',
        });
      }

      if (userId === user._id) {
        // Make sure to define currentUserId from auth
        return showToast({ message: 'You cannot change your own admin status.', type: 'error' });
      }

      const res = await makeAdmin(userId); // API call

      queryClient.setQueryData(
        ['users', usersSearch_Submitted, usersSearch_FinalTerm, filterUsers],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              users: page.users.map((user) =>
                user._id === userId ? { ...user, idAdmin: !user.idAdmin } : user
              ),
            })),
          };
        }
      );

      showToast({
        message: res.idAdmin ? 'User is now an admin.' : 'User is no longer an admin.',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      showToast({ message: 'Failed to toggle admin status.', type: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const ownerId = '67e1e4243797128f37393189';

      if (userId === ownerId) {
        return showToast({
          message: 'You cannot delete the server owner.',
          type: 'error',
        });
      }

      if (userId === user._id) {
        return showToast({
          message: 'You cannot delete your own account.',
          type: 'error',
        });
      }

      await deleteUser(userId); // API call to delete (ban) the user

      // Remove the user from the local cache
      queryClient.setQueryData(
        ['users', usersSearch_Submitted, usersSearch_FinalTerm, filterUsers],
        (oldData) => {
          if (!oldData) return oldData;

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              users: page.users.filter((user) => user._id !== userId), // Remove user
            })),
          };
          return newData;
        }
      );

      // Show success message
      showToast({ message: 'User has been banned.', type: 'success' });
    } catch (error) {
      console.error(error);
      showToast({ message: 'Failed to ban user.', type: 'error' });
    }
  };

  if (isError) {
    showToast({ message: error.message, type: 'error' });
  }

  return (
    <div className='w-full px-0 md:px-6 py-3'>
      <div className='w-full overflow-x-scroll md:overflow-x-hidden'>
        <table className='w-full text-sm text-left'>
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
                        // User row
                        <Fragment key={user._id}>
                          <tr
                            className={`border-b border-light text-darker font-smallMedium cursor-pointer ${
                              userSelected === user._id || contextMenuUser === user
                                ? 'border-opacity-100'
                                : 'border-opacity-30 hover:border-opacity-100'
                            }`}
                            onClick={() => {
                              userSelected === user._id
                                ? setUserSelected(null)
                                : setUserSelected(user._id);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();

                              const menuWidth = 200; // (adjust as needed)
                              const menuHeight = 100; // (adjust as needed)

                              let xPos = e.clientX + 20;
                              let yPos = e.clientY;

                              const screenWidth = window.innerWidth;
                              if (xPos + menuWidth > screenWidth) {
                                xPos = screenWidth - menuWidth - 20;
                              }

                              const screenHeight = window.innerHeight;
                              if (yPos + menuHeight > screenHeight) {
                                yPos = screenHeight - menuHeight + 20;
                              }

                              setShowContextMenu(true);
                              setContextMenuPoints({ x: xPos, y: yPos });
                              setContextMenuUser(user);
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

        {/* Context menu */}
        <AnimatePresence>
          {showContextMenu && contextMenuUser && (
            <ContextMenu
              user={contextMenuUser}
              handleToggleAdmin={handleToggleAdmin}
              handleDeleteUser={handleDeleteUser}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersList;
