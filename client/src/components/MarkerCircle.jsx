import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

const MarkerCircle = ({
  hovered,
  cubicBezierVar,
  width,
  height,
  strokeWidth,
}) => {
  return (
    <AnimatePresence>
      {hovered && (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className={`absolute z-0`}
          style={{
            width: `${width}`,
            height: `${height}`,
          }}
          preserveAspectRatio="xMidYMid meet"
          key="hovered-ellipse"
        >
          <motion.ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="10"
            fill="transparent"
            stroke="black"
            strokeWidth={strokeWidth}
            initial={{ strokeDashoffset: 200 }}
            animate={{
              strokeDashoffset: 0,
            }}
            exit={{
              strokeDashoffset: 200,
            }}
            transition={{
              duration: 0.6,
              ease: cubicBezierVar,
            }}
            style={{ strokeDasharray: 200 }}
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
};

MarkerCircle.propTypes = {
  hovered: PropTypes.bool.isRequired,
  cubicBezierVar: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  strokeWidth: PropTypes.string.isRequired,
};

export default MarkerCircle;
