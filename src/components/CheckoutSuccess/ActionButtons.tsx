import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  bookingId: number;
}

const ActionButtons: React.FC<Props> = ({ bookingId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-3 ">
      <button
        className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
};

export default ActionButtons;
