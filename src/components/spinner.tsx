import React from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-4",
  lg: "w-12 h-12 border-[6px]",
};

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-black border-transparent ${sizeClass} ${className}`}
    />
  );
};

export default Spinner;
