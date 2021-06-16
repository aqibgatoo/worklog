import { Layout } from "../src/layout";
import { LoginForm } from "../src/components";

export interface LoginProps {}

const Login = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

export default Login;
