import React from "react";
import CheckoutAdditionalRequest from "../../components/Checkout/CheckoutAdditionalRequest";
import CheckoutContactInfo from "../../components/Checkout/CheckoutContactInfo";
import CheckoutPaymentMethod from "../../components/Checkout/CheckoutPaymentMethod";
import CheckoutReviewTerms from "../../components/Checkout/CheckoutReviewTerms";
import CheckoutTravellerInfo from "../../components/Checkout/CheckoutTravellerInfo";

const CheckoutMain: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Thông tin liên hệ */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <CheckoutContactInfo />
      </div>

      {/* Thông tin hành khách */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <CheckoutTravellerInfo />
      </div>

      {/* Yêu cầu bổ sung */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <CheckoutAdditionalRequest />
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <CheckoutPaymentMethod />
      </div>

      {/* Điều khoản & xác nhận */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <CheckoutReviewTerms />
      </div>
    </div>
  );
};

export default CheckoutMain;
