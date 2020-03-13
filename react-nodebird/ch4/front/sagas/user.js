import { all, fork, takeLatest, put } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user';

function loginAPI() {
  // 서버에 요청을 보내는 부분
}

/**
 * 로그인 동작
 * 
 * request: 서버에 요청
 *      --- 
 *  이 사이가 비동기로 처리해야될 부분이다. 이 비동기처리를 saga가 도와주는 것.
 *      ---
 * response: 로그인 성공
 * response: 로그인 실패
 * 
 */

function* login() {
  try {
    yield put({ // put은 dispatch와 동일.
      type: LOG_IN_SUCCESS,
    });
  } catch (e) { // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

function* watchLogin() {
  // takeLatest가 LOG_IN액션이 dispatch되길 기다려서 dispatch될 때
  // login 제너레이터를 호출한다.
  yield takeLatest(LOG_IN, login);
}

export default function* userSaga() {
  yield all([
    fork( watchLogin ),
  ]);
}