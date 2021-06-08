import Document, { Html, Main, NextScript, Head } from "next/document";
import { InitializeColorMode } from "reflexjs";

export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script src="https://apis.google.com/js/platform.js"></script>
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
