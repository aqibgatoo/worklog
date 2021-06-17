import { ReactNode, useEffect, useState } from "react";
import { AuthContext, CreateUser, User } from "./AuthContext";
import { useRouter } from "next/router";

type BasicAuthProviderProps = {
  children: ReactNode;
};
const mapper = (data: any): User => ({
  username: data.current_user.name,
  id: data.current_user.uid,
});
const BasicAuthProvider = ({ children }: BasicAuthProviderProps) => {
  const { push } = useRouter();
  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState<string>(localStorage.getItem("token"));
  useEffect(() => {
    if (token) {
      push("/");
    } else {
      push("/login");
    }
  }, [token]);

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
      const base64EncodedToken = btoa(
        `${credentials.name}:${credentials.pass}`
      );
      localStorage.setItem("token", base64EncodedToken);
      setToken(base64EncodedToken);
      const normlaizedUser = mapper(await result.json());
      localStorage.setItem("user", JSON.stringify(normlaizedUser));
      setUser(normlaizedUser);
    } else {
      const data = await result.json();
      throw new Error(data.message);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
    token,
    user,
    login,
    signUp,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default BasicAuthProvider;
