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
            <div className="flex flex-col h-60 lg:h justify-between items-center">
              <div className="flex flex-col w-full gap-2">
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
                  className="text-lg md:text-xl font-bigThird text-darkest hover:text-darker cursor-pointer text-ellipsis line-clamp-3 md:line-clamp-2"
                >
                  {post.title}
                </Link>
              </div>
              {/* Post Votes */}
              <div className="w-full">
                <p className="font-small text-lg text-dark">
                  {post.likes.length} votes
                </p>
              </div>
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
