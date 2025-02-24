import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const AuthorOtherPosts = ({ posts }) => {
  const [isDragging, setIsDragging] = useState(false);
  let startX = 0;
  const dragThreshold = 10;

  const settings = {
    infinite: false,
    dots: false,
    arrows: false,
    speed: 300,
    slidesToShow: ,
    slidesToScroll: 3,
  };

  const handleMouseDown = (e) => {
    setIsDragging(false);
    startX = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (Math.abs(e.clientX - startX) > dragThreshold) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (e, navigate) => {
    if (!isDragging) {
      navigate();
    }
  };

  return (
    <div>
      <div
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
      >
        <Slider {...settings}>
          {posts.map((post) => (
            <div key={post._id}>
              <div className="flex flex-col h-56 md:h-[280px] lg:h-56 justify-between items-center">
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
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={(e) =>
                      handleMouseUp(
                        e,
                        () => (window.location.href = `/post/${post._id}`)
                      )
                    }
                    className="text-lg md:text-xl font-bigThird text-darkest hover:text-light text-ellipsis line-clamp-3 md:line-clamp-2"
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
    </div>
  );
};

AuthorOtherPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default AuthorOtherPosts;
