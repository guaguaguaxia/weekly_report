import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-F0GCM1QNBF"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-F0GCM1QNBF');
              `,
            }}
          />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Simplify your chat content in seconds."
          />
          <meta property="og:site_name" content="Chat Simplifier" />
          <meta
            property="og:description"
            content="Simplify your chat content in seconds."
          />
          <meta property="og:title" content="Chat Simplifier" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Chat Simplifier" />
          <meta
            name="twitter:description"
            content="Simplify your chat content in seconds."
          />
          <meta
            property="og:image"
            content="https://chat-simplifier.vercel.app/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://chat-simplifier.vercel.app/og-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
