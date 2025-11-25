import React, { useState } from "react";
import Modal from "./Modal";

const EditUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("ABC Travel");

  const handleSave = () => {
    console.log("Saving user   :", name);
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Edit Supplier
      </button>

      <Modal
        isOpen={isOpen}
        title="Edit Supplier"
        onClose={() => setIsOpen(false)}
      >
        <label className="block mb-2 font-medium">Supplier Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg w-full p-2 mb-4"
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
      </Modal>
    </div>
  );
};

export default EditUserModal;
