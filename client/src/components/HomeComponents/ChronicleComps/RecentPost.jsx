import PropTypes from "prop-types";
import moment from "moment";
import { useUserStore } from "../../../stores/useUserStore";
import { Link } from "react-router-dom";
import formatNumber from "../../../lib/formatNumber";

const RecentPost = ({ post }) => {
  const { user } = useUserStore();

  return (
    <div className="flex flex-col gap-1 text-sm">
      {/* Top section */}
      <div className="flex items-center justify-between font-mediumSecondary text-dark">
        <p>
          <Link className="cursor-pointer" to={`/profile/${post.author._id}`}>
            {user && post.author._id === user._id ? (
              <p className="font-mediumSecondary text-xs text-darker bg-lightish hover:bg-light hover:text-lightest px-5">
                You
              </p>
            ) : (
              <p className="font-mediumSecondary text-darker">
                by{" "}
                <span className="lowercase hover:text-darkest hover:underline">
                  {post.author.name}
                </span>
              </p>
            )}
          </Link>
        </p>
        <p>{moment(post.createdAt).fromNow()}</p>
      </div>
      {/* Middle section */}
      <div className="w-full">
        <Link
          to={`/post/${post._id}`}
          className="text-lg font-bigThird cursor-pointer text-ellipsis line-clamp-2 hover:text-light"
        >
          {post.title}
        </Link>
      </div>
      {/* Bottom section */}
      <div className="flex justify-start gap-3 font-smallMedium text-dark">
        <p className="cursor-pointer hover:text-darkest">
          {formatNumber(post.likes.length)} upvotes
        </p>
        <p className="cursor-pointer hover:text-darkest">
          {formatNumber(post.comments)} comments
        </p>
      </div>
    </div>
  );
};

RecentPost.propTypes = {
  post: PropTypes.object.isRequired,
};
export default RecentPost;
