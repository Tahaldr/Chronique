import PropTypes from "prop-types";

import AdminDashboard from "../../pages/HomePages/AdminDashboard";
import TheChronicle from "../../pages/HomePages/TheChronicle";

const HomeBody = ({ active, activeCategory, searchFinalTerm }) => {
  const renderContent = () => {
    switch (active) {
      case "chronicle":
        return (
          <TheChronicle
            activeCategory={activeCategory}
            searchFinalTerm={searchFinalTerm}
          />
        );
      case "admin":
        return <AdminDashboard />;
      default:
        return <TheChronicle />;
    }
  };
  // mt-[-160px] md:mt-[-103px]

  return (
    <div
      className={`${
        active === "chronicle"
          ? "mt-[-160px] md:mt-[-103px]"
          : "mt-[-46px] md:mt-[-48px]"
      } `}
    >
      {renderContent()}
    </div>
  );
};

HomeBody.propTypes = {
  active: PropTypes.string.isRequired,
  activeCategory: PropTypes.string.isRequired,
  searchFinalTerm: PropTypes.string.isRequired,
};

export default HomeBody;
