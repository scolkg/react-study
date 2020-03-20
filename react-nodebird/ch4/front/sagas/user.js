import { all, fork, takeLatest, put, take } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user';

const HELLO_SAGA = 'HELLO_SAGA';

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
  //yield takeLatest(LOG_IN, login);


  // take() 가 대기하고 있다가 (중단점) LOG_IN이라는 액션이 실행되면 중단점이 풀려서 LOG_IN_SUCCESS가 자동실행된다.
  while (true) {
    yield take(LOG_IN);
    yield put({ // put은 Saga의 리덕스의 dispatch역할을 한다고 생각하면 됨.
      type: LOG_IN_SUCCESS,
    });
  }
}

function* hello() {
  try {
    yield put({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      type: 'HELLO_TWO',
    });
    console.log('hello');
  } catch (e) {
    console.error(e);
  }
}

function* watchHello() {
  console.log('before saga');
  while (true) { // hello_saga를 2번 이상 호출할 때 이렇게 무한 반복문으로 전부 호출 할 수 있다.
    // take(HELLO_SAGA) ->  HELLO_SAGA를 기다리겠다. - 해당 액션이 dispatch되면 제너레이터를 enxt하는 이펙트이다.
    yield take(HELLO_SAGA); // HELLO_SAGA 액션이 take 가 받으면 yield(중단점)이 풀려서 다음 라인이 진행된다.

    console.log('hello saga');
  }
  // 비동기 요청, 타이머 넣어도 되고...
}

export default function* userSaga() {
  yield all([ // all 은 여러 이펙트를 동시에 실행할 수 있게 함.
    watchHello(),
    watchLogin(),
    
  ]);
  
/*   yield all([
    fork( watchLogin ),
  ]); */
}