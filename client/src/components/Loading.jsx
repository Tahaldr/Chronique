import { motion } from "framer-motion";
import { RiLoader5Fill } from "react-icons/ri";
import PropTypes from "prop-types";

const Loading = ({ size, color }) => {
  return (
    <motion.div
      className="absolute"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
    >
      <RiLoader5Fill className={`text-${size}  text-${color}`} />
    </motion.div>
  );
};

Loading.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
};

export default Loading;
