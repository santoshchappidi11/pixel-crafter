import React from "react";
import { RxCross2 } from "react-icons/rx";

interface handleCardCloseBtnProps {
  handlePostDelete: (postId: string | number) => void;
  postId: string | number;
}

const CardCloseBtn: React.FC<handleCardCloseBtnProps> = ({
  handlePostDelete,
  postId,
}) => {
  return (
    <div key={postId}>
      <RxCross2
        className="absolute right-2 top-2 text-gray-100 cursor-pointer"
        size={25}
        onClick={() => handlePostDelete(postId)}
      />
    </div>
  );
};

export default CardCloseBtn;
