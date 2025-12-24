import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import paymentService from "../../api/payment.service";
import { useNavigate } from "react-router-dom";

const SubmitOrderButton: React.FC = () => {
  const checkout = useSelector((state: RootState) => state.checkout);
  const navigate = useNavigate();

  const handlePay = async () => {
    const { bookingId, method, amount, currency, agreeTerms } = checkout;

    if (!bookingId || !method || !amount || !currency) {
      alert("Thiếu thông tin thanh toán. Vui lòng kiểm tra lại.");
      return;
    }

    if (!agreeTerms) {
      alert("Vui lòng đồng ý với điều khoản trước khi thanh toán.");
      return;
    }

    const res = await paymentService.createPayment({
      bookingId,
      method,
      amount,
      currency,
      status: "pending",
    });

    if (method === "bank_transfer") {
      navigate(`/checkout/${bookingId}/success`, {
        state: {
          bookingId,
          paymentMethod: "bank_transfer",
        },
      });
    }

    if (method === "cash") {
      navigate(`/checkout/${bookingId}/success`, {
        state: {
          bookingId,
          paymentMethod: "cash",
        },
      });
    }
  };

  return (
    <>
      <button
        className="w-full bg-rose-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-rose-700 transition"
        onClick={handlePay}
      >
        Tiến hành thanh toán
      </button>
    </>
  );
};

export default SubmitOrderButton;
