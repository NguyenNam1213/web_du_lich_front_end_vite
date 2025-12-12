import React, { useEffect } from "react";
import { Activity } from "../../types/activity";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setAmount, setCurrency } from "../../store/slices/checkoutSlice";

interface Props {
  tour: Activity;
  participants: number;
}

const PriceBreakdown: React.FC<Props> = ({ tour, participants }) => {
  const dispatch = useDispatch();
  const checkout = useSelector((state: RootState) => state.checkout);

  const basePrice = tour.price * participants;
  const totalPrice = checkout.amount ?? basePrice;

  useEffect(() => {
    // Khởi tạo giá gốc & currency
    if (!checkout.amount) {
      dispatch(setAmount(basePrice));
    }
    dispatch(setCurrency(tour.currency));
  }, [basePrice, tour.currency, checkout.amount, dispatch]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Chi tiết giá</h2>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Giá tour</span>
          <span>
            {tour.price.toLocaleString("vi-VN")} {tour.currency}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Số người</span>
          <span>{participants}</span>
        </div>

        {checkout.discount ? (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>
              -{checkout.discount.toLocaleString("vi-VN")} {checkout.currency}
            </span>
          </div>
        ) : null}

        <div className="flex justify-between font-semibold text-blue-600 border-t pt-3 mt-3">
          <span>Tổng cộng</span>
          <span>
            {totalPrice.toLocaleString("vi-VN")} {checkout.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
