import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const showToast = ({ message, type }) => {
  const typeStyle = "text-xl text-dark";

  toast.custom(
    (t) => (
      <motion.div
        className={`relative w-[330px] h-[110px] flex items-center justify-center overflow-hidden cursor-pointer`}
        onClick={() => toast.dismiss(t.id)} // Correctly dismiss the toast on click
      >
        <img
          src="/OtherImg/ToastCustomPaper.png"
          alt="ToastBg"
          className="bg-no-repeat absolute w-full h-full"
        />
        <div className="absolute w-[90%] h-[85%] flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <div className="">
              {type === "success" ? (
                <AiOutlineCheckCircle className={`${typeStyle}`} />
              ) : type === "error" ? (
                <AiOutlineCloseCircle className={`${typeStyle}`} />
              ) : (
                <AiOutlineExclamationCircle className={`${typeStyle}`} />
              )}
            </div>

            <div className="text-sm text-dark text-justify font-smallSemiBoldItalic">
              {message}
            </div>
          </div>
          <div className="flex items-center justify-center text-xs font-small text-light">
            <p>click the message to close</p>
          </div>
        </div>
      </motion.div>
    ),
    {
      duration: 2000,
      position: "top-right",
      reverseOrder: true,
    }
  );
};

export default showToast;
