import PropTypes from "prop-types";

import AdminDashboard from "../../pages/HomePages/AdminDashboard";
import TheChronicle from "../../pages/HomePages/TheChronicle";
import About from "../../pages/HomePages/About";

const HomeBody = ({ active, activeCategory }) => {
  const renderContent = () => {
    switch (active) {
      case "chronicle":
        return <TheChronicle activeCategory={activeCategory} />;
      case "about":
        return <About />;
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
};

export default HomeBody;
