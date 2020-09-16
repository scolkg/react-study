import { all, fork } from 'redux-saga/effects'; // 사가 이펙트를 임포트하고

import userSaga from './user';
import postSaga from './post';


// 만들고 싶은 비동기 액션들을 정의해준다.
// fork: 제네레이터 함수를 '비동기' 실행해준다.
// call: 제네레이터 함수를 '동기' 실행해준다.
export default function* rootSaga() {
  yield all([ // all은 배열안의 요소를 한번에 실행.
    fork(userSaga),
    fork(postSaga),
  ]);
}