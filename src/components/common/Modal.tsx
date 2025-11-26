import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      {/* Overlay mờ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Popup content */}
      <div
        className="relative bg-white p-6 rounded-xl shadow-lg z-10 w-full max-w-md"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
