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
  commentOptionsPosition: PropTypes.string.isRequired,
  setCommentDeleteConfirm: PropTypes.func.isRequired,
};

export default CommentOptionsDropdown;
