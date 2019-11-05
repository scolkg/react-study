import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';

const NodeBird = ( { Component } ) => {
    return (
        <>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
            </Head>
            <AppLayout>
                <Component />
            </AppLayout>
        </>
    );
};

NodeBird.propTypes = {
    Component: PropTypes.elementType,
}

// _app.js 로 이름을 지으면 자동으로 최상위 부모 레이아웃 컴포넌트가 된다.
export default NodeBird;
