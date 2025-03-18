import { MdOutlinePerson } from 'react-icons/md';
import { MdOutlineArticle } from 'react-icons/md';
import { MdOutlineShield } from 'react-icons/md';
import { RiRadioButtonLine } from 'react-icons/ri';
import { MdOutlineTrendingUp } from 'react-icons/md';
import { MdTrendingDown } from 'react-icons/md';
import formatNumber from '../../lib/formatNumber';
import Tooltip from '../Elements/Tooltip';

const AdminStats = () => {
  const stats = [
    {
      icon: <MdOutlinePerson />,
      title: 'Total users',
      number: formatNumber(1000),
      tooltip: 1000 + ' users',
      trendstate: 'up',
      trend: 30.5,
      days: 15,
    },
    {
      icon: <MdOutlineArticle />,
      title: 'Total posts',
      number: formatNumber(1000),
      tooltip: 1000 + ' posts',
      trendstate: 'up',
      trend: 30.5,
      days: 15,
    },
    {
      icon: <MdOutlineShield />,
      title: 'Total admins',
      number: formatNumber(1000),
      tooltip: 1000 + ' admins',
      trendstate: 'none',
      trend: 0,
      days: 0,
    },
    {
      icon: <RiRadioButtonLine />,
      title: 'Inactive users',
      number: formatNumber(1000),
      tooltip: 1000 + ' users',
      trendstate: 'up',
      trend: 20.56,
      days: 30,
    },
  ];

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
                        {stat.trendstate === 'up' && (
                          <MdOutlineTrendingUp className='text-green-800' />
                        )}
                        {stat.trendstate === 'down' && <MdTrendingDown className='text-red-800' />}
                        {stat.trendstate === 'none' && <MdOutlineTrendingUp />}
                        <div className='flex items-center gap-3'>
                          <p
                            className={`flex items-center gap-1 text-sm ${
                              stat.trendstate === 'up' ? 'text-green-800' : 'text-red-800'
                            }`}>
                            <p>{stat.trend}</p> <span>%</span>
                          </p>
                          <p className='text-sm text-darkish whitespace-nowrap'>
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
