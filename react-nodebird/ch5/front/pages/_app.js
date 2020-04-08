import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';

// 모든 컴포넌트가 _app.js 를 공유하기 때문에 여기서 redux를 react와 연결하면
// 모든 컴포넌트가 redux를 사용하게? 됨.

// 자동으로 _app.js 는 최상위 부모 컴포넌트가 된다.
const NodeBird = ({ Component }) => ( // Next에서 자동으로 _app.js에 Component(페이지들)을 넣어준다
  <>
    <Head>
      <title>NodeBird~!</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
    </Head>
    <AppLayout>
      <Component />
    </AppLayout>
  </>
);

NodeBird.propTypes = {
  Component: PropTypes.elementType,
};
NodeBird.defaultProps = {
  Component: PropTypes.elementType,
};


export default NodeBird;
