import { useContext } from "react";
import { AdminDashboardContext } from "../../App";

const ReasonsDropDown = () => {
  const { setReasonSelected, setReasonDropDownShow } = useContext(
    AdminDashboardContext
  );

  const reasonCapitalize = (reason) => {
    return reason.charAt(0).toUpperCase() + reason.slice(1);
  };

  const reasons = [
    "inappropriate",
    "spam",
    "haram",
    "offensive",
    "harassment",
    "racism",
    "hate speech",
    "misinformation",
    "other",
  ];

  return (
    <div className="absolute w-full border border-light border-opacity-50 bg-lightish text-sm font-smallMedium text-dark">
      {reasons.map((reason, index) => (
        <p
          className="px-3 py-1 hover:bg-lighter cursor-pointer"
          onClick={() => {
            setReasonSelected(reason);
            setReasonDropDownShow(false);
          }}
        >
          {reasonCapitalize(reason)}
        </p>
      ))}
    </div>
  );
};

export default ReasonsDropDown;
