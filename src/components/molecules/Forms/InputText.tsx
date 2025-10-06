import React, { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { useFormControl } from "./FormControl";
import { FormHelperText } from "./FormHelperText";
import { FormErrorMessage } from "./FormErrorMessage";

export interface InputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  maxLength?: number;
  prefixMaxLength?: string;
  inputValidation?: "onlyNumber" | "phoneNumber";
  classNameLabel?: string;
  withTogglePassword?: boolean; // <-- tambahan
}

export function InputText({
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
  type = "text",
  withTogglePassword = false, // default false
  ...rest
}: InputTextProps) {
  const { id } = useFormControl();
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const isPasswordField = type === "password" && withTogglePassword;

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
      <div className="relative">
        <input
          id={id}
          name={name}
          value={value ?? ""}
          placeholder={placeholder}
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          onChange={handleOnChange}
          className={clsx(
            "block w-full rounded-lg border px-3 py-2 text-sm outline-none",
            isInvalid
              ? "border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10",
            isPasswordField && "pr-10", // padding ekstra biar ga ketimpa tombol
            className
          )}
          {...rest}
        />

        {isPasswordField && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

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

export const CLabel = ({
  id,
  classNameLabel,
  isRequired,
  label,
}: {
  id: string;
  classNameLabel?: string;
  isRequired?: boolean;
  label: string;
}) => {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "block text-sm font-medium text-gray-800 mb-1",
        classNameLabel
      )}
    >
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
  );
};
