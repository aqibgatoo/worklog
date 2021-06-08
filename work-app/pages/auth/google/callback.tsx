import { useRouter } from "next/router";

export interface CallbackProps {}

const Callback = ({}: CallbackProps) => {
  const router = useRouter();
  console.log(router);

  return <div></div>;
};

export default Callback;
