import Modal from "../common/Modal";

const PaypalModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-3">Thanh toán PayPal</h2>
      <p>Bạn sẽ được chuyển hướng sang PayPal để thanh toán.</p>
      <button className="bg-yellow-500 w-full py-2 rounded-lg mt-4">
        Continue with PayPal
      </button>
    </Modal>
  );
};

export default PaypalModal;