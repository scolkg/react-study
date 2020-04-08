import React from 'react';
import Link from 'next/link';

const Home = () => (
  <>
    <div>Hello</div>
    <Link href="/about"><a>Go to about</a></Link>
  </>
);

export default Home;
