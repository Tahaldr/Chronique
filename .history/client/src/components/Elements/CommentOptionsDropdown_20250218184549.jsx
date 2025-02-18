import { useUserStore } from "../../stores/useUserStore";

const CommentOptionsDropdown = ({
  comment,
  commentOptionsPosition,
  setCommentOptionsPosition,
  commentOptionsShow,
  
}) => {
  const { user } = useUserStore();

  return <div>CommentOptionsDropdown</div>;
};

export default CommentOptionsDropdown;
