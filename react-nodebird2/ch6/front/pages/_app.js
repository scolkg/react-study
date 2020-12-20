import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
// import withReduxSaga from 'next-redux-saga'; // next9부터 사용할 필요가 없어졌다

import wrapper from '../store/configureStore';

// pages내부의 index.js의 리턴이 Component가 된다.(즉 _app.js가 부모가 된다.)
const NodeBird = ({ Component }) => (
  <>
    <Head>
      <title>NodeBird</title>
    </Head>
    <Component />
  </>
);

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux((NodeBird));
