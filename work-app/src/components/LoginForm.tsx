import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "../../src/components";
import { useAuth } from "../auth/AuthContext";

export interface LoginFormProps {}

type Login = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submit = async ({ username, password }: Login) => {
    const payload = {
      name: username,
      pass: password,
    };
    try {
      await login(payload);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="username"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              handleInputChange={onChange}
              label="Username"
              placeholder=""
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              type="password"
              handleInputChange={onChange}
              label="Password"
              placeholder=""
            />
          )}
        />
        {errorMessage && (
          <p color="red" my="3">
            {errorMessage}
          </p>
        )}
        <p my="3">
          Don't have an account?{" "}
          <Link href="/signup" passHref>
            <a>SignUp</a>
          </Link>
        </p>
        <Button label="Login" loading={loading} type="submit" />
      </form>
    </div>
  );
};

export default LoginForm;
