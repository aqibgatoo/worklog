import { createContext, useContext } from "react";

export type User = {
  name: string;
  email: string;
};

export type AuthContextType = {
  user?: User;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
