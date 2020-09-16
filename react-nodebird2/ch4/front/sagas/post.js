<<<<<<< HEAD
import { all, fork, takeLatest, put, call } from "redux-saga/effects";
=======
import { all, fork, take, call, put, takeLatest, delay } from 'redux-saga/effects'; // 사가 이펙트를 임포트하고
>>>>>>> 514192d2507f155eea95a8d30e20ef1cb6d45dff
import axios from 'axios';

function addPostAPI(data) {
  return axios.post('/api/addPost', data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: 'ADD_POST_SUCCESS',
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'ADD_POST_FAILURE',
      data: err.response.data,
    });
  }
}

<<<<<<< HEAD
function* watchAddPost() {
  yield takeLatest('ADD_POST_REQUEST', addPost);
}


export default function* postSaga() {
  yield all([
    fork(watchAddPost),
  ]);
=======

function* watchAddPost() {
  yield take('ADD_POST_REQUEST', addPost);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
  ])
>>>>>>> 514192d2507f155eea95a8d30e20ef1cb6d45dff
}