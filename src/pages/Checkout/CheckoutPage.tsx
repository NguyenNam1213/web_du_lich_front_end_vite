import React, { useEffect } from "react";
import CheckoutMain from "./CheckoutMain";
import CheckoutSummary from "./CheckoutSummary";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBookingId } from "../../store/slices/checkoutSlice";

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { tour, date, participants } = location.state || {};
  const {id} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) dispatch(setBookingId(Number(id)));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-sm py-4 mb-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-800">Thanh toán đặt tour</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 flex gap-6">
        <div className="w-2/3">
          <CheckoutMain />
        </div>

        <div className="w-1/3">
          <CheckoutSummary
            tour={tour}
            date={date}
            participants={participants}
           />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
