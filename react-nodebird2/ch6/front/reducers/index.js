import { HYDRATE } from 'next-redux-wrapper'; // 서버사이트랜더링을 위해 HYDRATE 추가

import { combineReducers } from 'redux';
import user from './user';
import post from './post';

// 서버사이드랜더링에서 index안에 index, user, post가 들어가 있는 구조가 되므로
// user, post 따로 최상위로 각각 존재하게 하려고 아래처럼 바꿔줘야 한다.
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
