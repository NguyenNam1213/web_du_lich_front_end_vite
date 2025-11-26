import React, { useEffect, useState } from "react";
import paymentService from "../../api/payment.service";
import { BankInfo } from "../../types/payment";
import Modal from "../common/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BankTransferModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [bank, setBank] = useState<BankInfo | null>(null);

  useEffect(() => {
    if (isOpen) {
      paymentService.getBankInfo().then(setBank);
    }
  }, [isOpen]);

  if (!bank) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-3">Thanh toán chuyển khoản</h2>

      <div className="space-y-2">
        <p><strong>Ngân hàng:</strong> {bank.bankName}</p>
        <p><strong>Chủ tài khoản:</strong> {bank.ownerName}</p>
        <p><strong>Số tài khoản:</strong> {bank.accountNo}</p>

        {bank.qrCode && (
          <img
            src={bank.qrCode}
            alt="QR chuyển khoản"
            className="w-60 mx-auto mt-4"
          />
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full py-2 bg-gray-700 text-white rounded-lg"
      >
        Đóng
      </button>
    </Modal>
  );
};

export default BankTransferModal;
