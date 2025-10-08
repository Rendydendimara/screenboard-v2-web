import { ReactNode } from "react";

interface FormControlProps {
  isRequired?: boolean;
  isInvalid?: boolean;
  children: ReactNode;
  className?: string;
  label?: string;
}

export function FormControlSelect({
  children,
  className,
  label,
  isRequired = true,
}: FormControlProps) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium" htmlFor="patient-kelurahan">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
