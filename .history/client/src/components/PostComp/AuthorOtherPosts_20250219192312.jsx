import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AuthorOtherPosts = ({ posts }) => {
  const settings = {
    infinite: false,
    dots: false,
    arrows: false,
    speed: 300,
    slidesToShow: 5.3,
    slidesToScroll: 4,
    speed: 300,
  }
  
  
  return <div>
    <Slider {...} ></Slider>
  </div>;
};

AuthorOtherPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default AuthorOtherPosts;
