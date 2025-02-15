import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();

  return (
    <p
      className="w-fit font-bigPrimary py-1 px-3 rounded-full flex justify-center items-center gap-2 bg-lighter
      border border-dark hover:border-darkest text-dark hover:text-darkest absolute top-5 left-5 z-40"
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

export default BackBtn;
