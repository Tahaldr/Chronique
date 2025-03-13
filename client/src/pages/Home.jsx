import { useRef, useState } from 'react';
import HomeBody from '../components/HomeComponents/HomeBody';
import HomeHeader from '../components/HomeComponents/HomeHeader';
import HomeNav from '../components/HomeComponents/HomeNav';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

import Transition from '../components/Transition';

const Home = () => {
  const ref = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('chronicle');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFinalTerm, setSearchFinalTerm] = useState('');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const navY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    if (previous > latest && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <div className='w-full h-screen'>
        <div
          className={`
            ${active === 'chronicle' ? 'mb-[150px] md:mb-[100px]' : 'mb-[38px] md:mb-[44px]'} 
            w-full p-4 overflow-hidden relative grid`}
          ref={ref}>
          <HomeHeader navY={navY} />
        </div>

        <div className='w-full'>
          <HomeNav
            hidden={hidden}
            setActive={setActive}
            active={active}
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSearchFinalTerm={setSearchFinalTerm}
            // searchFinalTerm={searchFinalTerm}
          />
          <HomeBody
            active={active}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSearchFinalTerm={setSearchFinalTerm}
            searchFinalTerm={searchFinalTerm}
          />
        </div>
      </div>
    </>
  );
};

const HomeTransition = (props) => <Transition OgComponent={Home} {...props} />;

export default HomeTransition;

// export default Home;
