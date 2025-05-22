import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Tooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className='relative w-full flex flex-col items-center z-[60]'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className='absolute -top-8 bg-lightish font-smallMedium text-sm text-darkish px-1 whitespace-nowrap'
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0,
                duration: 0.1,
                ease: [0.18, 0.69, 0.5, 0.72],
              },
            }}
            transition={{
              duration: 0.1,
              delay: 0.7,
              ease: [0.18, 0.69, 0.5, 0.72],
            }}>
            {text}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

export default Tooltip;
