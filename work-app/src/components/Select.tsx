import { FormEvent } from "react";

type Enum = {
  [key: string]: string;
};

export type InputProps = {
  label: string;
  value?: any;
  options: Enum;
  handleChange: (event: FormEvent<HTMLSelectElement>) => void;
};

const Input = ({ value, label, handleChange, options }: InputProps) => {
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
      <select
        flex="1"
        ml=""
        p="2"
        borderColor="white"
        value={value}
        outline="none"
        onChange={handleChange}
        rounded="4"
        id={label}
      >
        {Object.entries(options).map(([key, value]) => (
          <option key={key} disabled={value === "None"} value={value}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Input;
