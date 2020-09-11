export const initialState = {
  isLoggingIn: false, // 로그인 시도중
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  signUpData: {},
  loginData: {},
}

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  }
}

export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  }
}

// 동적 액선 생성기. 이렇게 쓴다 -> store.dispatch(changeNickname('mighty tak'));
export const changeNickname = (data) => {
  return {
    type: 'CHANGE_NICKNAME',
    data,
  }
};


// saga의 watchLogin*() 과 거의 동시에 reducer의 이 LOG_IN_REQUEST로 함께 실행된다.
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST :
      console.log('reducer login request');
      return {
        ...state,
        isLoggingIn: true,
      }
    case LOG_IN_SUCCESS :
      console.log('reducer login success');
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: 'zerocho'},
      }
    case LOG_IN_FAILURE :
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        me: action.data,
      }
    case LOG_OUT_REQUEST :
      return {
        ...state,
        isLoggingOut: true,
      }
    case LOG_OUT_SUCCESS :
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      }
    case LOG_OUT_FAILURE :
      return {
        ...state,
        isLoggingOut: false,
        me: null,
      }
    default :
      return state;
  }
};

export default reducer;