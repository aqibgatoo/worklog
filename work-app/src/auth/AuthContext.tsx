import { createContext, useContext } from "react";

export type User = {
  id?: string;
  username: string;
  email?: string;
};

export type CreateUser = {
  name: string;
  mail: string;
  pass: string;
};

export type AuthContextType = {
  user?: User;
  token?: string;
  signUp: (data: CreateUser) => void;
  login: (credentials: any) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  signUp: (data: CreateUser) => {},
  login: (credentials: any) => {},
  logout: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
