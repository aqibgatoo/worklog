import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "reflexjs";
import theme from "../src/theme";
import "../src/styles.css";
import dynamic from "next/dynamic";
const AuthProvider = dynamic(
  () => import("../src/auth/AuthProvider"),
  { ssr: false }
);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
