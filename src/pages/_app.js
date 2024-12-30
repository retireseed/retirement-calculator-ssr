import Layout from '../components/Layout';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  return (
  
    <Layout>
        <Head>
        <title>Retirement Calculator</title>
        <meta name="description" content="Secure Your Retirement with Confidence! Our easy-to-use Retirement 
        Calculator helps you plan for a comfortable future by forecasting your financial needs." />
    
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;