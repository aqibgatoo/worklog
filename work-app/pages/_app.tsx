import * as React from "react";
import { AppProps } from "next/app";
import Router from "next/router";
import { ThemeProvider } from "reflexjs";
import theme from "../src/theme";
import "../src/styles.css";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const BasicAuthProvider = dynamic(
  () => import("../src/auth/BasicAuthProvider"),
  { ssr: false }
);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <BasicAuthProvider>
        <Component {...pageProps} />
      </BasicAuthProvider>
    </ThemeProvider>
  );
}
