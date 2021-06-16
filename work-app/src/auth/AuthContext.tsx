import { createContext, useContext } from "react";

// export type User = {
//   name: string;
//   email: string;
// };
export type User = {
  id?: string;
  username: string;
  logoutToken?: string;
  email?: string;
  csrfToken?: string;
};

export type CreateUser = {
  name: string;
  mail: string;
  pass: string;
};

export type AuthContextType = {
  user?: User;
  signUp: (data: CreateUser) => void;
  login: (credentials: any) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signUp: (data: CreateUser) => {},
  login: (credentials: any) => {},
  logout: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
