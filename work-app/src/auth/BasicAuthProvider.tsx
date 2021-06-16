import { ReactNode, useEffect, useState } from "react";
import { AuthContext, CreateUser, User } from "./AuthContext";
import { useRouter } from "next/router";

type BasicAuthProviderProps = {
  children: ReactNode;
};
const mapper = (data: any): User => ({
  username: data.current_user.name,
  id: data.current_user.id,
  csrfToken: data.csrf_token,
  logoutToken: data.logout_token,
});
const BasicAuthProvider = ({ children }: BasicAuthProviderProps) => {
  const { push } = useRouter();
  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem("user"))
  );
  useEffect(() => {
    if (user) {
      push("/");
    } else {
      push("/login");
    }
  }, [user]);

  const login = async (credentials) => {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/user/login?_format=json`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );
    if (result.status === 200) {
      const user = await result.json();
      const normlaizedUser = mapper(user);
      localStorage.setItem("user", JSON.stringify(normlaizedUser));
      setUser(normlaizedUser);
    } else {
      const data = await result.json();
      throw new Error(data.message);
    }
  };

  const logout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const logoutToken = user.logout_token;
    const csrfToken = user.csrf_token;
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/user/logout?_format=json&token=${logoutToken}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    if (result.status === 200) {
      localStorage.removeItem("user");
      setUser(null);
    } else {
      console.log(result.body);
      //TODO: throw error instead of logging out the error message
      // throw new Error();
    }
  };
  const signUp = async (user: CreateUser) => {
    const payload = {
      name: [{ value: user.name }],
      mail: [{ value: user.mail }],
      pass: [{ value: user.pass }],
    };
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/user/register?_format=json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (result.status == 200) {
      push("/login");
      return;
    } else {
      const data = await result.json();
      throw new Error(data.message);
    }
  };
  const value = {
    user,
    login,
    signUp,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default BasicAuthProvider;
