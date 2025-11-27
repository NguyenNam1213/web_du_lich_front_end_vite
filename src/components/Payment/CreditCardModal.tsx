import Modal from "../common/Modal";

const CreditCardModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold">Thanh toán bằng thẻ</h2>

      <input className="border p-2 w-full mt-3" placeholder="Số thẻ" />
      <input className="border p-2 w-full mt-3" placeholder="MM/YY" />
      <input className="border p-2 w-full mt-3" placeholder="CVV" />

      <button
        onClick={onClose}
        className="mt-4 bg-blue-600 text-white w-full py-2 rounded-lg"
      >
        Xác nhận
      </button>
    </Modal>
  );
};

export default CreditCardModal;