import { useUserStore } from "../../stores/useUserStore";

const CommentOptionsDropdown = ({
  comment,
  commentOptionsPosition,
  setCommentDeleteConfirm,
}) => {
  const { user } = useUserStore();

  return <div>CommentOptionsDropdown</div>;
};

CommentOptionsDropdown.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentOptionsDropdown;
