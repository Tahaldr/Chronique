import { useUserStore } from "../../stores/useUserStore";

const CommentOptionsDropdown = ({
  comment,
  commentOptionsPosition,
  commentOptionsPosition
}) => {
  const { user } = useUserStore();

  return <div>CommentOptionsDropdown</div>;
};

export default CommentOptionsDropdown;
