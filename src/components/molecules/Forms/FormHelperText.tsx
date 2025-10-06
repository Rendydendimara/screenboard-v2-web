import React from "react";
import { useFormControl } from "./FormControl";

interface FormHelperTextProps {
  message?: string;
  className?: string;
}

export function FormHelperText({ message, className }: FormHelperTextProps) {
  const { helperId } = useFormControl();
  if (!message) return null;

  return (
    <p id={helperId} className={`text-xs text-gray-500 ${className ?? ""}`}>
      {message}
    </p>
  );
}
