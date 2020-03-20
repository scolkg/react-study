/** 
 * Redux -> React의 state는 쓰지 않아도 돼요.
 * 안정성, state 통제 용이.
 * 단점: 코드가 많아짐.
*/

const dummyUser = {
    nickname: '스콜',
    Post: [],
    Followings: [],
    Followers: [],
    signUpData: {},
};

// store
export const initialState = {
    isLoggingIn: false,
    isLoggedIn: false,
    isLoading: false,
    user: null,
};

export const LOG_IN = 'LOG_IN'; // 액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'; 
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'; 
export const LOG_OUT = 'LOG_OUT';
export const SIGN_UP = 'SIGN_UP'; 
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

// action -> state를 바꾸는 행동
export const loginAction = {
    type: LOG_IN,
};
export const logoutAction = {
    type: LOG_OUT,
};
export const signUpAction = (data) => { // 회원가입처럼 동적 데이터는 액션을 리턴하는 함수로 만들면 된다.
    return {
        type: SIGN_UP,
        data: data,
    }
};
export const signUpSuccess = {
    type: SIGN_UP_SUCCESS,
}

// reducer -> action의 결과로 state를 어떻게 바꿀지 정의
const reducer = (state = initialState, action) => {
    switch( action.type ) {
        case LOG_IN: {
            return {
                ...state,
                isLoggingIn: true,
                isLoading: true,
            };
        }
        case LOG_IN_SUCCESS: {
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: true,
                user: dummyUser,
                isLoading: false,
            };
        }
        case LOG_OUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        }
        case SIGN_UP: {
            return {
                ...state,
                signUpData: action.data,
            };
        }
        default: { 
            return {
                ...state,
            }
        }
    }  
};

export default reducer;