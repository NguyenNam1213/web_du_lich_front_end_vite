import React from "react";
import { Activity } from "../../types/activity";

interface Props {
  tour: Activity;
  participants: number;
}

const PriceBreakdown: React.FC<Props> = ({ tour, participants }) => {
  const price = tour.price * participants;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Chi tiết giá</h2>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Giá tour</span>
          <span>{tour.price.toLocaleString("vi-VN")} {tour.currency}</span>
        </div>

        <div className="flex justify-between">
          <span>Số người</span>
          <span>{participants}</span>
        </div>

        <div className="flex justify-between font-semibold text-blue-600 border-t pt-3 mt-3">
          <span>Tổng cộng</span>
          <span>
            {price.toLocaleString("vi-VN")} {tour.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
