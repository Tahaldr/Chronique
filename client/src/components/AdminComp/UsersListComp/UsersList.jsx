import { Fragment, useEffect, useState } from 'react';
import Usercard from './Usercard';
import Tooltip from '../../Elements/Tooltip';
import { useUserStore } from '../../../stores/useUserStore';

const UsersList = () => {
  const [userSelected, setUserSelected] = useState(null);
  const { getAllUsers, getOnlyUsers, getOnlyAdmins, searchUsers } = useUserStore();

  const users = [
    {
      _id: '67d93b6f7f46b5fbee89df65',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1742289774/Chronique/users/q77l9qcd4pex9r1z9bd2.png',
      name: 'Mohammed',
      email: 'mohammed@gmail.com',
      password: 'Simo-1234',
      idAdmin: false,
      createdAt: '2025-03-18T09:22:55.585Z',
      updatedAt: '2025-03-18T09:22:55.585Z',
      __v: 0,
      votes: 0,
      postCount: 0,
    },
    {
      _id: '67d58d64fb47dda95a9fbc31',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg',
      name: 'Hamza ML',
      email: 'hamza@ml.com',
      password: 'Hamza-1234',
      idAdmin: false,
      createdAt: '2025-03-15T14:23:32.503Z',
      updatedAt: '2025-03-15T14:23:32.503Z',
      __v: 0,
      votes: 2,
      postCount: 1,
    },
    {
      _id: '67d4379d15552526d768a767',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg',
      name: 'Maroc Leasing',
      email: 'ml@gmail.com',
      password: 'Maroc-2025',
      idAdmin: false,
      createdAt: '2025-03-14T14:05:17.583Z',
      updatedAt: '2025-03-14T14:05:17.583Z',
      __v: 0,
      votes: 0,
      postCount: 0,
    },
    {
      _id: '67d0cf86b2cbd6d8a4bb3d97',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg',
      name: 'Mehdi tekkak',
      email: 'mehdi@tekkak.com',
      password: 'Mehdi-1234',
      idAdmin: false,
      createdAt: '2025-03-12T00:04:22.747Z',
      updatedAt: '2025-03-12T00:04:22.747Z',
      __v: 0,
      votes: 0,
      postCount: 0,
    },
    {
      _id: '677aad28b5ea87314848e6ad',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg',
      name: 'Taha Lazy ',
      email: 'taha@taha.com',
      password: 'Taha1234',
      idAdmin: false,
      createdAt: '2025-01-05T16:02:48.177Z',
      updatedAt: '2025-01-05T16:02:48.177Z',
      __v: 0,
      votes: 1,
      postCount: 1,
    },
    {
      _id: '67635949fbea7c5778836e7e',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1734564170/Chronique/users/xaoauy1cyaal71untvs9.png',
      name: 'fffff',
      email: 'ffff@gmail.com',
      password: 'ffffffff',
      idAdmin: false,
      createdAt: '2024-12-18T23:22:49.857Z',
      updatedAt: '2024-12-18T23:22:49.857Z',
      __v: 0,
      votes: 0,
      postCount: 0,
    },
    {
      _id: '6763579357668c3fc5203047',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1731399276/Chronique/users/defaultUserPfp.jpg',
      name: 'John doe',
      email: 'cccc@gmail.com',
      password: 'cccccccc',
      idAdmin: false,
      createdAt: '2024-12-18T23:15:31.209Z',
      updatedAt: '2024-12-18T23:15:31.209Z',
      __v: 0,
      votes: 1,
      postCount: 2,
    },
    {
      _id: '67635670307b03fc34b576e9',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1734563441/Chronique/users/ddbfyley2giha8mdhmuk.jpg',
      name: 'Mike waterson',
      email: 'zz@gmail.com',
      password: 'zzzzzzzzzz',
      idAdmin: true,
      createdAt: '2024-12-18T23:10:40.685Z',
      updatedAt: '2024-12-18T23:10:40.685Z',
      __v: 0,
      votes: 16,
      postCount: 23,
    },
    {
      _id: '676355beca924798ae8db64d',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1734563261/Chronique/users/u0t7wbitasvl4zfto60h.jpg',
      name: 'Bilal ',
      email: 'bi@gmail.com',
      password: 'bbbbbbbb',
      idAdmin: false,
      createdAt: '2024-12-18T23:07:42.088Z',
      updatedAt: '2024-12-18T23:07:42.088Z',
      __v: 0,
      votes: 0,
      postCount: 0,
    },
    {
      _id: '6763557772e73a3cd5620554',
      userPic:
        'https://res.cloudinary.com/dv48ogvly/image/upload/v1734563191/Chronique/users/j4d7fb7mwto3ftkbzcvr.jpg',
      name: 'Taha nd',
      email: 'tahanaitdo@gmail.com',
      password: 'ttttttttt',
      idAdmin: false,
      createdAt: '2024-12-18T23:06:31.615Z',
      updatedAt: '2024-12-18T23:06:31.615Z',
      __v: 0,
      votes: 0,
      postCount: 0,
    },
  ];

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
            {users.map((user) => (
              <Fragment key={user._id}>
                <tr
                  className={`border-b border-light text-darker font-smallMedium cursor-pointer ${
                    userSelected === user._id
                      ? 'border-opacity-100'
                      : 'border-opacity-30 hover:border-opacity-100'
                  }`}
                  onClick={() => {
                    userSelected === user._id ? setUserSelected(null) : setUserSelected(user._id);
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
