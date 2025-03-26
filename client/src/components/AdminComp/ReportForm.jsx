import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminDashboardContext } from "../../App";
import { RxCross2 } from "react-icons/rx";
import { MdArrowBackIos } from "react-icons/md";
import ReasonsDropDown from "../Elements/ReasonsDropDown";
import { useReportStore } from "../../stores/useReportStore";

const ReportForm = () => {
  const reportFormRef = useRef();
  const [description, setDescription] = useState("");
  const { createReport, loading } = useReportStore();
  const {
    reportFormShow,
    setReportFormShow,
    reasonDropDownShow,
    setReasonDropDownShow,
    reasonSelected,
  } = useContext(AdminDashboardContext);
  const [report, setReport] = useState({
    type: reportFormShow.type,
    post: reportFormShow.post,
    comment: reportFormShow.comment,
    reason: reasonSelected,
    description: "",
  });

  // Disable scrolling but keep the scrollbar visible
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // Restore original styles when modal is closed
      document.body.style.overflowY = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  // handle click outside to dissappear
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reportFormRef.current &&
        !reportFormRef.current.contains(event.target)
      ) {
        setReportFormShow(false);
      }
    };

    // Add the event listener only when the modal is active
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reportFormRef, setReportFormShow]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setReport({ ...report, reason: reasonSelected, description });
    const updatedReport = { ...report, reason: reasonSelected, description };

    const res = await createReport(updatedReport);

    // if (res.newReport) {
    //   setReportFormShow({
    //     type: "post",
    //     post: "",
    //     comment: "",
    //   });
    // }
  };

  useEffect(() => {
    console.log(report);
    // console.log(reportFormShow);
  }, [report]);

  //   useEffect(() => {
  //     createReport({
  //       comment: "",
  //       description: "adadad",
  //       post: "676a8e5b970b6b88d66e77aa",
  //       reason: "inappropriate",
  //       type: "post",
  //     });
  //   }, []);

  return (
    <motion.div
      className="w-screen h-screen fixed z-[70] top-0 left-0 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div
        ref={reportFormRef}
        className="h-2/4 w-3/4 md:w-2/4 bg-lighter p-5 flex flex-col gap-5 relative"
      >
        {/* Close btn */}
        <div className="absolute top-5 right-5 cursor-pointer hover:text-light">
          <RxCross2
            className="text-2xl"
            onClick={() => setReportFormShow(false)}
          />
        </div>

        {/* Title */}
        <h5 className="text-3xl font-bigThird text-darker">
          Create your report
        </h5>

        {/* Report form */}
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-3 w-full"
        >
          {/* Reason */}
          <div className="flex items-center gap-5">
            <label
              htmlFor="reason"
              className="font-mediumPrimary text-darkish w-[11%]"
            >
              Reason
            </label>

            {/* Reason select */}
            <div className="w-full relative">
              {/* Select toggle */}
              <button
                className="w-full px-3 py-2 bg-lightish text-sm font-smallMedium text-dark cursor-pointer
                border border-light hover:bg-light hover:bg-opacity-50 border-opacity-50 outline-none flex justify-between items-center"
                onClick={(e) => {
                  e.preventDefault();
                  setReasonDropDownShow(!reasonDropDownShow);
                }}
              >
                <span>{reasonSelected}</span>
                <MdArrowBackIos
                  className={` ${
                    reasonDropDownShow ? "mt-1 rotate-90" : "-mt-1 -rotate-90"
                  }`}
                />
              </button>

              {/* Select dropdown */}
              {reasonDropDownShow && <ReasonsDropDown />}
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-5">
            <label
              htmlFor="description"
              className="font-mediumPrimary text-darkish w-[11%]"
            >
              Content
            </label>
            {/* Content textarea */}
            <textarea
              id="description"
              className="resize-none w-full outline-none py-2 px-3 bg-lightish
               font-smallMedium text-darker text-sm border border-light border-opacity-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            ></textarea>
          </div>

          {/* Submit btn */}
          <button
            type="submit"
            className="w-full bg-dark text-lightest hover:bg-darker font-bigPrimary text-2xl"
          >
            Create
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ReportForm;
