import React, {
  ChangeEvent,
  DetailedHTMLProps,
  FormEvent,
  InputHTMLAttributes,
} from "react";

export type InpuType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export type InputProps = {
  type?: InpuType;
  label: string;
  value?: any;
  placeholder?: string;
  handleInputChange: (event: FormEvent<HTMLInputElement>) => void;
};

const Input = ({
  type = "text",
  value,
  label,
  placeholder,
  handleInputChange,
}: InputProps) => {
  return (
    <div
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      mb="4"
    >
      <label fontSize="md" htmlFor={label}>
        {label}
      </label>
      <input
        flex="1"
        ml=""
        p="2"
        borderColor="white"
        value={value}
        outline="none"
        onChange={handleInputChange}
        rounded="4"
        type={type}
        id={label}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
