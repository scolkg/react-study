import { all, fork, takeLatest } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS } from '../reducers/user';

function loginAPI() {
  // 서버에 요청을 보내는 부분
}

function* login() {
  try {
    yield call( loginAPI );
    yield put({ // put은 dispatch와 동일.
      type: LOG_IN_SUCCESS
    });
  } catch(e) { // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

// 로그인 액션을 기다림.
function* watchLogin() {
  yield takeLatest( LOG_IN, login ); // login()을 실행
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
  ]);
}