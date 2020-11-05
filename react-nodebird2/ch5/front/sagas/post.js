import { all, fork, takeLatest, put, call, delay, throttle } from "redux-saga/effects";
import shortId from 'shortid';
import axios from 'axios';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  LOAD_POSTS_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  generateDummyPost,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function addPostAPI(data) {
  return axios.post('/post', { content: data });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: result.data,
      },
    });
    // 동시에  user reducer의 액션도 호출하여 user reducer의 데이터도 변경 가능!
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get('/api/posts', data);
}

function* loadPosts(action) {
  try {
    console.log('loadPosts saga request!');
    // const result = yield call(loadPostsAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10),
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete('/api/removePost', data);
}

function* removePost(action) {
  try {
    // const result = yield call(removePostAPI, action.data);
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    // 동시에  user reducer의 액션도 호출하여 user reducer의 데이터도 변경 가능!
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  // 어차피 data안에 게시글 아이디가 있으니 주소에 게시글 아이디 없어도 되지만
  // 이렇게 하면 좀 더 이 주소가 어떤 의미인지 알아보기 쉽다.
  return axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
}

function* addComment(action) {
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchLoadPosts() {
  // 스크롤링을 내리다 보면 픽셀단위로 순식간에 많은 수의 이벤트가 발생하기 때문에 많은 호출이 일어난다.
  // 그래서 throttle 로 한번실행되고 몇 초동안 쉬게 해서 한번만 호출되도록 방지!
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
  // yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadPosts),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
