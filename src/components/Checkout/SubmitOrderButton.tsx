import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import paymentService from "../../api/payment.service";
import BankTransferModal from "../Payment/BankTransferModal";
import CreditCardModal from "../Payment/CreditCardModal";
import PaypalModal from "../Payment/PaypalModal";

const SubmitOrderButton: React.FC = () => {
  const checkout = useSelector((state: RootState) => state.checkout)

  const [openBank, setOpenBank] = useState(false);
  const [openCredit, setOpenCredit] = useState(false);
  const [openPaypal, setOpenPaypal] = useState(false);

  const handlePay = async () => {
    const { bookingId, method, amount, currency} = checkout;
    if (!bookingId || !method || !amount || !currency) {
      alert("Thiếu thông tin thanh toán. Vui lòng kiểm tra lại.");
      return;
    };
    const res = await paymentService.createPayment({
      bookingId,
      method,
      amount,
      currency,
      status: "pending"
    })

     if (checkout.method === "bank_transfer") {
      setOpenBank(true);
    }
    else if (checkout.method === "credit_card") {
      setOpenCredit(true);
    }
    else if (checkout.method === "paypal") {
      setOpenPaypal(true);
    }
  }
  return (
    <>
      <button 
        className="w-full bg-rose-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-rose-700 transition"
        onClick={handlePay}
      >
        Tiến hành thanh toán
      </button>
      <BankTransferModal isOpen={openBank} onClose={() => setOpenBank(false)} />
      <CreditCardModal isOpen={openCredit} onClose={() => setOpenCredit(false)} />
      <PaypalModal isOpen={openPaypal} onClose={() => setOpenPaypal(false)} />
    </>
  );
};

export default SubmitOrderButton;
