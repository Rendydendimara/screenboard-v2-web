import React from "react";
import Spinner from "./spinner";

interface CModalDialogLoadingProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

const CModalDialogLoading: React.FC<CModalDialogLoadingProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, // Ensures it's above other UI elements
      }}
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        style={{
          position: "relative",
          width: "50px",
          height: "50px",
        }}
      >
        <Spinner size="lg" />
      </div>
    </div>
  );
};

export default CModalDialogLoading;
