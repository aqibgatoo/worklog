import { ChangeEvent, FormEvent } from "react";

type Enum<E> = Record<keyof E, string>;

export type InputProps<T> = {
  label: string;
  value?: any;
  options: Enum<T>;
  handleChange: (event: FormEvent<HTMLSelectElement>) => void;
};

const Input = <T,>({ value, label, handleChange, options }: InputProps<T>) => {
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
