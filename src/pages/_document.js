import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';
import Script from 'next/script';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          {/* Google Tag Manager */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16686993907"></script>
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6TTFR93J5X');
            `
          }} />
          {/* End Google Tag Manager */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Cookieyes code snippet */}
          <Script
            id="cookieyes"
            strategy="afterInteractive"
            src="https://cdn-cookieyes.com/client_data/cb4d4f4b150e1520e8ccdc35/script.js"
          />
          {/* End Cookieyes code snippet */}
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};