import React from "react";
import { Button } from "./button";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName?: string;
  isLoadingAction: boolean;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  isLoadingAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Delete
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{customerName}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            disabled={isLoadingAction}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
