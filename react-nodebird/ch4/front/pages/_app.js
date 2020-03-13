import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';
import { createStore, compose, applyMiddleware } from 'redux';
import withRedux from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';

const NodeBird = ( { Component, store } ) => {
    return (
        <Provider store={ store }>
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
    store: PropTypes.object,
}

// _app.js 로 이름을 지으면 자동으로 최상위 부모 레이아웃 컴포넌트가 된다.
// withRedux로 NodeBird를 감싸줘서 store를 전달해줄 수 있게 하는 것.
export default withRedux((initialState, options) => {
    const sagaMiddleware = createSagaMiddleware(); // 리덕스-사가 미들웨어 생성
    const middlewares = [ sagaMiddleware ]; // 리덕스에 사가 미들웨어 넣기

    const enhancer = process.env.NODE_ENV === 'production'
        ? compose( applyMiddleware(...middlewares) )
        : compose(
            applyMiddleware(...middlewares),
            !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    );
    const store = createStore(reducer, initialState, enhancer);
    
    // 여기다가 store 커스터마이징할 수 있다.
    sagaMiddleware.run(rootSaga); // rootSaga를 sagaMiddleware에 연결.

    return store;
})(NodeBird);
