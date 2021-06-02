import { Icon } from "reflexjs";

type LoaderProps = {
  size?: number;
};

const Loader = ({ size = 34 }: LoaderProps) => {
  return <Icon name="loader" size={size} />;
};

export default Loader;
