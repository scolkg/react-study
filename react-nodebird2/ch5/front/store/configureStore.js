import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);

  return next(action);
};

const configureStore = (context) => {
  console.log(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [ loggerMiddleware, sagaMiddleware ];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(applyMiddleware(...middlewares))
  
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'deveolopment',
});

export default wrapper;
