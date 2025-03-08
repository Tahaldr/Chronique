import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BackBtn = ({ type }) => {
  const navigate = useNavigate();

  return (
    <p
      className={`w-fit font-bigPrimary py-1 px-3 rounded-lg flex justify-center items-center gap-2 absolute top-5 left-5 z-40 ${
        type === "create"
          ? "bg-darker border border-lighter border-opacity-50 hover:border-opacity-100 text-lighter hover:text-lightest"
          : "bg-lighter border border-dark hover:border-darkest text-dark hover:text-darkest"
      }`}
    >
      <button
        className="text-sm md:text-base flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <HiOutlineArrowLongRight className="text-lg md:text-xl rotate-180" />
        Back
      </button>
    </p>
  );
};

BackBtn.propTypes = { type: PropTypes.string };

export default BackBtn;
