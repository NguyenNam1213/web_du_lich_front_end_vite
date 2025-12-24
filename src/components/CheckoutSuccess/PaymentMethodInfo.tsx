import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import paymentService from "../../api/payment.service";
import { BankInfo } from "../../types/payment";
import { RootState } from "../../store";
import { convertToVND, getBankCode, generateVietQR } from "../Payment/CreateVietQR";

interface Props {
  paymentMethod: "cash" | "bank_transfer";
}

const PaymentMethodInfo: React.FC<Props> = ({ paymentMethod }) => {
  const [bank, setBank] = useState<BankInfo | null>(null);
  const [qrUrl, setQrUrl] = useState("");

  const { amount, currency, bookingId } = useSelector(
    (state: RootState) => state.checkout
  );

  if (!amount || !currency) return null;

  useEffect(() => {
    if (paymentMethod !== "bank_transfer") return;

    paymentService.getBankInfo().then((res) => {
      setBank(res);

      const price = convertToVND(amount, currency);
      const bankCode = getBankCode(res.bankName);
      const description = `Thanh toán đơn hàng #${bookingId}`;

      const qr = generateVietQR({
        bankCode,
        accountNo: res.accountNo,
        accountName: res.ownerName,
        amount: price,
        description,
      });

      setQrUrl(qr);
    });
  }, [paymentMethod, amount, currency, bookingId]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

      {/* CASH */}
      {paymentMethod === "cash" && (
        <div className="text-gray-700 text-sm space-y-1">
          <p>💵 <strong>Thanh toán bằng tiền mặt</strong></p>
          <p className="text-gray-500">
            Quý khách vui lòng thanh toán trực tiếp cho hướng dẫn viên khi tham gia tour.
          </p>
        </div>
      )}

      {/* BANK TRANSFER */}
      {paymentMethod === "bank_transfer" && bank && (
        <div className="space-y-3 text-sm text-gray-700">
          <p>🏦 <strong>Thanh toán bằng chuyển khoản ngân hàng</strong></p>

          <div className="space-y-1">
            <p><strong>Ngân hàng:</strong> {bank.bankName}</p>
            <p><strong>Chủ tài khoản:</strong> {bank.ownerName}</p>
            <p><strong>Số tài khoản:</strong> {bank.accountNo}</p>
            <p>
              <strong>Số tiền:</strong>{" "}
              {convertToVND(amount, currency).toLocaleString()} VND
            </p>
            <p className="text-gray-500 italic">
              Nội dung chuyển khoản: 
              <span className="font-medium"> Thanh toán đơn hàng #{bookingId}</span>
            </p>
          </div>

          {qrUrl && (
            <img
              src={qrUrl}
              alt="QR chuyển khoản"
              className="w-56 mx-auto mt-3"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodInfo;
