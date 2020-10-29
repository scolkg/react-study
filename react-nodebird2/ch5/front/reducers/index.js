import { HYDRATE } from 'next-redux-wrapper'; // 서버사이트랜더링을 위해 HYDRATE 추가

import { combineReducers } from 'redux';
import user from './user';
import post from './post';

// (이전상태, 액션) => 다음상태 를 만들어내는 것이 reducer이다.
const rootReducer = combineReducers({
  // 서버사이드랜더링을 위한 HYDRATE 사용을 위해 index추가.
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };

      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
