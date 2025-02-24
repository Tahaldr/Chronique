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
          <div key={post._id} className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              {/* Post Image */}
              <div className="aspect-[8/5] w-full border-[1px] border-opacity-30 border-dark overflow-hidden">
                <img
                  src={post.postPic}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              {/* Post Title */}
              <Link
                to={`/post/${post._id}`}
                className="text-xl font-bigThird text-darkest hover:text-darker cursor-pointer text-ellipsis line-clamp-2"
              >
                {post.title}
              </Link>
            </div>
            {/* Post Votes */}
            <div>
              <p>{post.likes.length} votes</p>
            </div>
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
