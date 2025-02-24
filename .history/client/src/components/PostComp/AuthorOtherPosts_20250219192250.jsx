import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AuthorOtherPosts = ({ posts }) => {
  const settings = {
    infinite: false,
    
  }
  
  
  return <div>
    <Slider {...} ></Slider>
  </div>;
};

AuthorOtherPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default AuthorOtherPosts;
