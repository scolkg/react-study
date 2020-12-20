import { all, fork, takeLatest, delay, put, call } from 'redux-saga/effects';
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
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_SUCCESS,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
} from '../reducers/user';

function removeFollowerAPI(data) {
  return axios.delete(`user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get('user/followings', data);
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowersAPI(data) {
  return axios.get('user/followers', data);
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch('user/nickname', { nickname: data });
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMyInfoAPI() {
  return axios.get('/user');
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

// loginAPI는 제네레이터 함수로 만들면 안된다.
function logInAPI(data) {
  return axios.post('/user/login', data);
}

function* logIn(action) {
  try {
    console.log('saga login request');
    // call()은 동기로 호출해서 loginAPI에서 결과까지 기다렸다가 다음 라인을 실행해준다. fork()는 비동기.
    // 그래서 여기서 fork를 쓰면 안되겠지. fork()를 쓴다면 yield가 있어도 소용없다. 그냥 비동기로 진행 됨.
    // call()은 동기로 호출해서 loginAPI에서 결과까지 기다렸다가 다음 라인을 실행해준다. 그래서 여기서 fork를 쓰면 안되겠지.
    // fork()를 쓴다면 yield가 있어도 소용없다. 그냥 비동기로 진행 됨.
    const result = yield call(logInAPI, action.data);

    yield put({ // put 은 액션을 실행하는 디스패치라고 생각하면 됨.
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

// 사가를 통해서 axois로 백엔드에게 요청을 보낸다.
function signUpAPI(data) {
  // post, put, patch 메소드만 data를 넘길 수 있다. (req.body...)
  return axios.post('/user', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    // throw new Error(''); // 일부러 에러 발생 시킴.
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
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

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSata() {
  yield all([
    fork(watchRemoveFollower),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchChangeNickname),
    fork(watchLoadUser),
    fork(watchLoadMyInfo),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
