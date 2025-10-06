import React from "react";
import clsx from "clsx";
import { useFormControl } from "./FormControl";
import { FormHelperText } from "./FormHelperText";
import { FormErrorMessage } from "./FormErrorMessage";
import { CLabel } from "./InputText";

export interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  maxLength?: number;
  prefixMaxLength?: string;
  inputValidation?: "onlyNumber" | "phoneNumber";
  classNameLabel?: string;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

export function InputTextArea({
  label,
  isRequired,
  isInvalid,
  errorMessage,
  maxLength,
  prefixMaxLength,
  inputValidation,
  classNameLabel,
  className,
  onChange,
  value,
  name,
  placeholder,
  rows = 3,
  resize = "vertical",
  ...rest
}: InputTextAreaProps) {
  const { id } = useFormControl();

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      let val = e.target.value ?? "";

      const handleChange = (v: string) => {
        if (!maxLength || v.length <= maxLength) {
          onChange({
            ...e,
            target: { ...e.target, value: v, name: e.target.name },
          });
        }
      };

      if (inputValidation === "onlyNumber") {
        val = val.replace(/[^0-9]/g, "");
        handleChange(val);
      } else {
        handleChange(val);
      }
    }
  };

  return (
    <div className="w-full">
      {label && (
        <CLabel
          id={id}
          label={label}
          isRequired={isRequired}
          classNameLabel={classNameLabel}
        />
      )}

      <textarea
        id={id}
        name={name}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={handleOnChange}
        rows={rows}
        className={clsx(
          "block w-full rounded-lg border px-3 py-2 text-sm outline-none",
          isInvalid
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10",
          resize === "none" && "resize-none",
          resize === "both" && "resize",
          resize === "horizontal" && "resize-x",
          resize === "vertical" && "resize-y",
          className
        )}
        {...rest}
      />

      {maxLength && (
        <FormHelperText
          message={`(${value?.toString().length ?? 0}/${maxLength}) ${
            prefixMaxLength ?? ""
          }`}
        />
      )}

      <FormErrorMessage message={errorMessage} />
    </div>
  );
}
