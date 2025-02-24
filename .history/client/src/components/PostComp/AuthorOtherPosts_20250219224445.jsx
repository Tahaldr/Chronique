import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const AuthorOtherPosts = ({ posts }) => {
  const settings = {
    infinite: false,
    dots: false,
    arrows: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <div>
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post._id}>
            <div>
              <img src={post.postPic} className="w-full" alt="" />
              <Link to={`/post/${post._id}`}>{post.title}</Link>
            </div>
            <div>
              
            </div>
            <p>{post.likes.length} votes</p>
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
