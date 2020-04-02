import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

const Home = () => (
  <>
    <Head>
      <title>NodeBird</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
    </Head>
    <AppLayout>
      <div>Hello</div>
      <Link href="/about"><a>Go to about</a></Link>
    </AppLayout>
  </>
);

export default Home;
