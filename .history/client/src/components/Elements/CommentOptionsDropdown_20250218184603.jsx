import { useUserStore } from "../../stores/useUserStore";

const CommentOptionsDropdown = ({
  comment,
  commentOptionsPosition,
  setCommentDeleteConfirm,
}) => {
  const { user } = useUserStore();

  return <div>CommentOptionsDropdown</div>;
};

export default CommentOptionsDropdown;
