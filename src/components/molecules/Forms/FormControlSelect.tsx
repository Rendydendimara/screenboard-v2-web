import { ReactNode } from "react";

interface FormControlProps {
  isRequired?: boolean;
  isInvalid?: boolean;
  children: ReactNode;
  className?: string;
  label?: string;
  errorMessage?: string;
}

export function FormControlSelect({
  children,
  className,
  label,
  isRequired = true,
  isInvalid = false,
  errorMessage,
}: FormControlProps) {
  return (
    <div className="space-y-2 w-full">
      <label
        className="text-sm font-medium font-secondary"
        htmlFor="patient-kelurahan"
      >
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      {children}
      {isInvalid && errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
