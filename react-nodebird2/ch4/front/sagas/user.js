import { all, fork, takeLatest, delay, put } from 'redux-saga/effects';
import axios from 'axios';

import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from '../reducers/user';

// loginAPI는 제네레이터 함수로 만들면 안된다.
function logInAPI(data) {
  return axios.post('/api/login', data);
}

function* logIn(action) {
  try {
    console.log('saga login request');
    // call()은 동기로 호출해서 loginAPI에서 결과까지 기다렸다가 다음 라인을 실행해준다. fork()는 비동기.
    // 그래서 여기서 fork를 쓰면 안되겠지. fork()를 쓴다면 yield가 있어도 소용없다. 그냥 비동기로 진행 됨.
    // call()은 동기로 호출해서 loginAPI에서 결과까지 기다렸다가 다음 라인을 실행해준다. 그래서 여기서 fork를 쓰면 안되겠지.
    // fork()를 쓴다면 yield가 있어도 소용없다. 그냥 비동기로 진행 됨.

    // const result = yield call(logInAPI, action.data);

    // 챕터5전엔 서버가 없으므로 delay 이펙트와 더미데이터를 이용하여 테스트
    yield delay(1000);

    yield put({ // put 은 액션을 실행하는 디스패치라고 생각하면 됨.
      type: LOG_IN_SUCCESS,
      data: action.data
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      data: err.response.data,
    })
  }
}

function logOutAPI() {
  return axios.post('/api/logout');
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      data: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post('/api/signup', data);
}

function* signUp(action) {
  try {
    // const result = yield call(signUpAPI);
    yield delay(1000);

    // throw new Error(''); // 일부러 에러 발생 시킴.

    yield put({
      type: SIGN_UP_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      data: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.post('/api/follow', data);
}

function* follow(action) {
  try {
    // const result = yield call(signUpAPI);
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      data: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.post('/api/unfollow', data);
}

function* unfollow(action) {
  try {
    // const result = yield call(signUpAPI);
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      data: err.response.data,
    });
  }
}

// 이벤트 리스터와 비슷한 역할. LOG_IN 이라는 액션이 들어오면 watchLogin이 보고있다가 logIn() 을 실행시킨다는 것.
// yield take() 는 1회용이다. 즉 한번 로그인하고 로그아웃 후에 다시 로그인은 안된다.
// while(true) 로 무한으로 쓸 수 있지만 이것보다 더 간단하게 takeEvery를 쓰거나 takeLatest를 쓰면 된다.
// takeLatest는 여러번 이벤트 클릭시에 마지막 클릭만 실행하는 것. takeEvery는 클릭한 수만큼 이벤트 실행되어 로그인 같은 액션에는 좋지 않다.
// takeLeading은 반대로 첫번째 클릭만 실행된다.
// takeLatest를 보통 많이 쓴다. 하지만 front단에서 게시글 저장 버튼을 여러번 클릭을 했을 때 그 요청들을 취소하는게 아니다. 
// 그래서 백단에선 실제론 여러개 저장되어 있을 수 있는 게 단점이다. 그래서 백단에서 검사를 해야 한다.
// 그래서 throttle('ADD_POST_REQUEST', 5000) 로 하면 5초간 한번만 실행되도록 하여 요청까지 취소할 수 있다.
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSata() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}