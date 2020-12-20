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
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

// 주의: data를 formData 그대로 넣어줘야 한다. (json으로 만들면 안됨)
function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    console.log(result);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

// 주의: data를 formData 그대로 넣어줘야 한다. (json으로 만들면 안됨)
function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  // 약속하기 나름 == return axios.patch(`/post/${data}/unlike`, data); 이렇게 써도 된다는 것.
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`, data);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/post', data);
}

function* addPost(action) {
  try {
    console.log('saga addPost request');
    console.log(action.data);
    const result = yield call(addPostAPI, action.data);
    console.log(result);
    console.log('====');
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    // 동시에  user reducer의 액션도 호출하여 user reducer의 데이터도 변경 가능!
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  // get요청 url에 한글은 인코딩해야 한다.
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostsAPI(lastId) {
  // get의 장점: 주소에 데이터가 다 들어있어서 데이터 캐싱이 유용하다. (post, patch등은 안되지)
  // mainPosts가 없어서 lastId 가 undefined 일 경우가 있으므로 체크.
  return axios.get(`/posts?lastId=${lastId || 0}}`);
}

function* loadPosts(action) {
  try {
    console.log('loadPosts saga request!');
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    // 동시에  user reducer의 액션도 호출하여 user reducer의 데이터도 변경 가능!
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
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
    const result = yield call(addCommentAPI, action.data);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadPosts() {
  // 스크롤링을 내리다 보면 픽셀단위로 순식간에 많은 수의 이벤트가 발생하기 때문에 많은 호출이 일어난다.
  // 그래서 throttle 로 한번실행되고 몇 초동안 쉬게 해서 한번만 호출되도록 방지!
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
  // yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
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

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchRetweet),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPosts),
    fork(watchLoadPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
