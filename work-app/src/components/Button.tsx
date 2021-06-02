import Loader from "./Loader";
export type ButtonType = "submit" | "reset" | "button";

export interface ButtonProps {
  width?: number;
  height?: number;
  type?: ButtonType;
  onClick?: () => void;
  label: string;
  loading?: boolean;
}

const Button = ({
  width = 20,
  height = 10,
  type = "button",
  onClick,
  label,
  loading = false,
}: ButtonProps) => {
  return (
    <button
      width={width}
      height={height}
      bg="green"
      rounded="2"
      color="white"
      type={type}
      onClick={onClick}
    >
      {loading ? <Loader /> : label}
    </button>
  );
};

export default Button;
