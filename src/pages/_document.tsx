import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#1976d2" />
          <meta name="description" content="Leave Management System for educational institutions" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
