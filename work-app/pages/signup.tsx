import { Layout } from "../src/layout";
import { SignUpForm } from "../src/components";

export interface SignUpProps {}

const SignUp = () => {
  return (
    <Layout>
      <SignUpForm />
    </Layout>
  );
};

export default SignUp;
