export const initialState = {
  isLoggedIn: false,
  me: null,
  signUpData: {},
  loginData: {},
}

export const loginAction = (data) => {
  return {
    type: 'LOG_IN',
    data,
  }
}

export const logoutAction = () => {
  return {
    type: 'LOG_OUT',
  }
}

// 동적 액선 생성기. 이렇게 쓴다 -> store.dispatch(changeNickname('mighty tak'));
export const changeNickname = (data) => {
  return {
    type: 'CHANGE_NICKNAME',
    data,
  }
};

// 비동적 액션 생성기.


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN' :
      return {
        ...state,
        isLoggedIn: true,
        me: action.data,
      }
    case 'LOG_OUT' :
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      }
    default :
      return state;
  }
};

export default reducer;