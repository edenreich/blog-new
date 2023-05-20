import { Html, Head, Main, NextScript } from 'next/document';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

function MyDocument(props: any) {
  const active = (pathname: string) => props.__NEXT_DATA__.page === pathname ? 'text-xl font-bold' : '';
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" href="/img/pencil.png"></link>
      </Head>
      <body>
        <header className="bg-gray-900">
          <Navigation active={active} />
        </header>
        <Main />
        <NextScript />
        <Footer />
      </body>
    </Html>
  );
}

export default MyDocument;
