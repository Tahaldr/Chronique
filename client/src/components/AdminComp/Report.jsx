import { useContext, useEffect, useRef } from "react";
import { AdminDashboardContext } from "../../App";
import { RxCross2 } from "react-icons/rx";
import { RiDownloadLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportTemp from "./ReportTemp";

const Report = () => {
  const reportRef = useRef(null);
  const { reportSelected, setReportSelected } = useContext(
    AdminDashboardContext
  );

  useEffect(() => {
    // Disable scrolling but keep the scrollbar visible
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportRef.current && !reportRef.current.contains(event.target)) {
        setReportSelected(null);
      }
    };

    // Add the event listener only when the modal is active
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reportRef, setReportSelected]);

  return (
    <motion.div
      className="w-screen h-screen fixed top-0 left-0 z-[60] bg-darkest bg-opacity-70 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // not working
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div ref={reportRef} className="h-2/4 w-3/4 md:w-2/4 bg-lighter p-5">
        <div className="w-full h-full relative text-darker">
          {/* Report close */}
          <div className="absolute top-0 right-0 cursor-pointer">
            <RxCross2
              className="text-2xl"
              onClick={() => setReportSelected(null)}
            />
          </div>

          {/* Download report as PDF */}
          <div className="absolute bottom-0 right-0 cursor-pointer">
            <PDFDownloadLink
              document={<ReportTemp reportSelected={reportSelected} />}
              fileName="report.pdf"
            >
              {({ loading }) =>
                loading ? "" : <RiDownloadLine className="text-2xl" />
              }
            </PDFDownloadLink>
          </div>

          {/* report details */}
          <div className="flex flex-col items-start gap-5 w-[90%] h-full overflow-y-scroll pr-5">
            {/* report title */}
            <h4 className="text-3xl font-bold font-bigThird">
              <span className="capitalize">{reportSelected?.type}</span> report
            </h4>
            {/* report ref */}
            <div className="flex flex-col gap-2 w-full font-smallMedium text-sm">
              <p className="w-full px-2 bg-lightish whitespace-nowrap">
                report id : {reportSelected?._id}
              </p>
              <p className="w-full px-2 bg-lightish whitespace-nowrap">
                report post : {reportSelected?.post}
              </p>
              {reportSelected?.comment && (
                <p className="w-full px-2 bg-lightish whitespace-nowrap">
                  report comment : {reportSelected?.comment}
                </p>
              )}
            </div>

            {/* reporter */}
            <div className="flex flex-col gap-1 border-l border-light pl-3 font-smallMedium text-sm">
              <p>
                <span className="font-smallSemiBold">Reporter id :</span>{" "}
                {reportSelected?.reporter?._id}
              </p>
              <p>
                <span className="font-smallSemiBold">Reporter name :</span>{" "}
                {reportSelected?.reporter?.name}
              </p>
            </div>

            {/* report content */}
            <div className="flex flex-col gap-1 border-l border-light pl-3 font-smallMedium text-sm">
              <p>
                <span className="font-smallSemiBold">Reason :</span>{" "}
                {reportSelected?.reason}
              </p>
              <p>
                <span className="font-smallSemiBold">Content :</span>{" "}
                {reportSelected?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Report;
