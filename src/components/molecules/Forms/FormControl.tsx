import React, { createContext, useContext, useId, ReactNode } from "react";

interface FormControlContextType {
  id: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  helperId: string;
  errorId: string;
}

const FormControlContext = createContext<FormControlContextType | null>(null);

export const useFormControl = () => {
  const ctx = useContext(FormControlContext);
  if (!ctx) throw new Error("useFormControl must be used inside <FormControl>");
  return ctx;
};

interface FormControlProps {
  id?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormControl({
  id,
  isRequired,
  isInvalid,
  children,
  className,
}: FormControlProps) {
  const reactId = useId();
  const baseId = id ?? `fc-${reactId}`;
  const helperId = `${baseId}-help`;
  const errorId = `${baseId}-error`;

  return (
    <FormControlContext.Provider
      value={{ id: baseId, isRequired, isInvalid, helperId, errorId }}
    >
      <div className={className}>{children}</div>
    </FormControlContext.Provider>
  );
}
