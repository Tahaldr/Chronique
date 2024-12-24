import PropTypes from "prop-types";

import AdminDashboard from "../../pages/HomePages/AdminDashboard";
import Description from "../../pages/HomePages/Description";
import TheChronicle from "../../pages/HomePages/TheChronicle";

const HomeBody = ({ active }) => {
  const renderContent = () => {
    switch (active) {
      case "chronicle":
        return <TheChronicle />;
      case "description":
        return <Description />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <TheChronicle />;
    }
  };

  return <div>{renderContent()}</div>;
};

HomeBody.propTypes = {
  active: PropTypes.string.isRequired,
};

export default HomeBody;
