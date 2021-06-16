import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "../../src/components";
import { CreateUser, useAuth } from "../auth/AuthContext";

export interface LoginFormProps {}

const SignUpForm = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUser>({
    defaultValues: {
      name: "",
      mail: "",
      pass: "",
    },
  });

  const submit = async (user: CreateUser) => {
    try {
      await signUp(user);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="name"
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
          name="mail"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              value={value}
              type="email"
              handleInputChange={onChange}
              label="Email"
              placeholder=""
            />
          )}
        />
        <Controller
          control={control}
          name="pass"
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
          Already have an account?{" "}
          <Link href="/login" passHref>
            <a>Login</a>
          </Link>
        </p>
        <Button label="Login" loading={loading} type="submit" />
      </form>
    </div>
  );
};

export default SignUpForm;
