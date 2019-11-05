import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';
import { Provider } from 'react-redux';
import reducer from '../reducers';

// 모든 컴포넌트가 _app.js 를 공유하기 때문에 여기서 redux를 react와 연결하면 
// 모든 컴포넌트가 redux를 사용하게? 됨.

const NodeBird = ( { Component } ) => {
    return (
        <Provider store={store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
            </Head>
            <AppLayout>
                <Component />
            </AppLayout>
        </Provider>
    );
};

NodeBird.propTypes = {
    Component: PropTypes.elementType,
}

// _app.js 로 이름을 지으면 자동으로 최상위 부모 레이아웃 컴포넌트가 된다.
export default NodeBird;
