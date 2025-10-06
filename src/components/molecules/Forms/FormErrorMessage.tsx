import React from "react";
import { useFormControl } from "./FormControl";

interface FormErrorMessageProps {
  message?: string;
  className?: string;
}

export function FormErrorMessage({
  message,
  className,
}: FormErrorMessageProps) {
  const { isInvalid, errorId } = useFormControl();
  if (!isInvalid || !message) return null;

  return (
    <p
      id={errorId}
      role="alert"
      className={`text-xs text-red-600 ${className ?? ""}`}
    >
      {message}
    </p>
  );
}
