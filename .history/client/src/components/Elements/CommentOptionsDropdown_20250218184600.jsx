import { useUserStore } from "../../stores/useUserStore";

const CommentOptionsDropdown = ({
  comment,
  commentOptionsPosition,
  commentOptionsPosition,
  setCommentDeleteConfirm
}) => {
  const { user } = useUserStore();

  return <div>CommentOptionsDropdown</div>;
};

export default CommentOptionsDropdown;
