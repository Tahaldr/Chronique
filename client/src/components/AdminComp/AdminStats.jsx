import { MdOutlinePerson } from 'react-icons/md';
import { MdOutlineArticle } from 'react-icons/md';
import { MdOutlineShield } from 'react-icons/md';
import { RiRadioButtonLine } from 'react-icons/ri';
import { MdOutlineTrendingUp } from 'react-icons/md';
import { MdTrendingDown } from 'react-icons/md';
import formatNumber from '../../lib/formatNumber';
import Tooltip from '../Elements/Tooltip';
import { useReportStore } from '../../stores/useReportStore';
import { useEffect, useState } from 'react';

const AdminStats = () => {
  const { siteStats } = useReportStore();
  const [stats, setStats] = useState([
    {
      icon: <MdOutlinePerson />,
      title: 'Total users',
      number: 0,
      tooltip: 0 + ' users',
      trendstate: 'up',
      trend: 0,
      days: 15,
    },
    {
      icon: <MdOutlineArticle />,
      title: 'Total posts',
      number: 0,
      tooltip: 0 + ' posts',
      trendstate: 'up',
      trend: 0,
      days: 15,
    },
    {
      icon: <MdOutlineShield />,
      title: 'Total admins',
      number: 0,
      tooltip: 0 + ' admins',
      trendstate: 'up',
      trend: 0,
      days: 15,
    },
    {
      icon: <RiRadioButtonLine />,
      title: 'Inactive users',
      number: 0,
      tooltip: 0 + ' users',
      trendstate: 'up',
      trend: 0,
      days: 30,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await siteStats();

      setStats([
        {
          icon: <MdOutlinePerson />,
          title: 'Total users',
          number: formatNumber(res.totalUsers),
          tooltip: res.totalUsers + ' users',
          trendstate: 'up',
          trend: res.userCreationPercentage,
          days: 15,
        },
        {
          icon: <MdOutlineArticle />,
          title: 'Total posts',
          number: formatNumber(res.totalPosts),
          tooltip: res.totalPosts + ' posts',
          trendstate: 'up',
          trend: res.postCreationPercentage,
          days: 15,
        },
        {
          icon: <MdOutlineShield />,
          title: 'Total admins',
          number: formatNumber(res.totalAdmins),
          tooltip: res.totalAdmins + ' admins',
          trendstate: 'none',
          trend: 0,
          days: 0,
        },
        {
          icon: <RiRadioButtonLine />,
          title: 'Inactive users',
          number: formatNumber(res.inactiveUsers),
          tooltip: res.inactiveUsers + ' users',
          trendstate: 'up',
          trend: res.inactiveUsersPercentage,
          days: 30,
        },
      ]);
    };

    fetchStats();
  }, [siteStats]);

  return (
    <div className='w-full px-10 md:px-6 py-3'>
      {/* Stats */}
      <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-5 font-smallMedium'>
        {stats.map((stat, index) => {
          return (
            // Each stat
            <div key={index} className='flex w-full h-32 px-4 gap-3 bg-lightish'>
              {/* Tooltip */}
              <Tooltip text={stat.tooltip}>
                <div className='w-full h-full grid grid-rows-3'>
                  {/* Title & icon */}
                  <div className='flex items-center gap-1 text-sm text-darkish'>
                    {stat.icon}
                    <p className='font-mediumPrimary'>{stat.title}</p>
                  </div>
                  {/* Number */}
                  <div className='text-2xl md:text-3xl text-darker'>{stat.number}</div>
                  {/* Trend */}
                  <div className='flex items-center gap-2'>
                    {stat.trendstate !== 'none' && (
                      <>
                        {/* Trend icon */}
                        {stat.trendstate === 'up' && (
                          <MdOutlineTrendingUp className='text-green-800' />
                        )}
                        {stat.trendstate === 'down' && <MdTrendingDown className='text-red-800' />}
                        {stat.trendstate === 'none' && <MdOutlineTrendingUp />}
                        {/* Trend percentage */}
                        <div className='flex items-center gap-3'>
                          <p
                            className={`flex items-center gap-1 text-sm ${
                              stat.trendstate === 'up' ? 'text-green-800' : 'text-red-800'
                            }`}>
                            <p>{stat.trend}</p> <span>%</span>
                          </p>
                          {/* Days before */}
                          <p className='text-sm text-darkish'>
                            {stat.days === 30 ? 'One month before' : '15 days before'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminStats;
