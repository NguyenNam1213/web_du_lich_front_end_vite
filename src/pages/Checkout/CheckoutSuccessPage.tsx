import React from "react";
import { useLocation } from "react-router-dom";
import ActionButtons from "../../components/CheckoutSuccess/ActionButtons";
import BookingInfoCard from "../../components/CheckoutSuccess/BookingInfoCard";
import NextSteps from "../../components/CheckoutSuccess/NextSteps";
import PaymentMethodInfo from "../../components/CheckoutSuccess/PaymentMethodInfo";
import SuccessHeader from "../../components/CheckoutSuccess/SuccessHeader";
import SupportInfo from "../../components/CheckoutSuccess/SupportInfo";


const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const { bookingId, paymentMethod } = location.state || {};

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">

        {/* 1. Header trạng thái */}
        <SuccessHeader paymentMethod={paymentMethod} />

        {/* 2. Thông tin booking */}
        <BookingInfoCard bookingId={bookingId} />

        {/* 3. Thông tin phương thức thanh toán */}
        <PaymentMethodInfo paymentMethod={paymentMethod} />

        {/* 4. Hướng dẫn tiếp theo */}
        <NextSteps paymentMethod={paymentMethod} />

        {/* 5. Hỗ trợ / cam kết */}
        <SupportInfo />

        {/* 6. CTA */}
        <ActionButtons bookingId={bookingId} />

      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
