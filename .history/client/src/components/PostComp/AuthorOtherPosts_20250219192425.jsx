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
    slidesToShow: 3,
    // slidesToScroll: 1,
  };

  return (
    <div>
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post._id}>
            <p>{post.title}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

AuthorOtherPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default AuthorOtherPosts;
