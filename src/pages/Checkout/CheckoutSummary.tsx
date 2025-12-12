import React from "react";
import ApplyCoupon from "../../components/Checkout/ApplyCoupon";
import OrderSummaryCard from "../../components/Checkout/OrderSummaryCard";
import PriceBreakdown from "../../components/Checkout/PriceBreakdown";
import SubmitOrderButton from "../../components/Checkout/SubmitOrderButton";
import { Activity } from "../../types/activity";

interface Props {
  tour: Activity;
  date: string;
  participants: number;
}

const CheckoutSummary: React.FC<Props> = ({ tour, date, participants }) => {
  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white rounded-2xl shadow-md p-5">
        <OrderSummaryCard tour={tour} date={date} participants={participants} />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <PriceBreakdown tour={tour} participants={participants} />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <ApplyCoupon />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <SubmitOrderButton />
      </div>
    </div>
  );
};

export default CheckoutSummary;
