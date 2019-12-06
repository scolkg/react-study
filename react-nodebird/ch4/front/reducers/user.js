const dummyUser = {
    nickname: '제로',
    Post: [],
    Followings: [],
    Followers: [],
    signUpData: {},
}

export const initialState = {
    isLoggedIn: false,
    user: null,
};

export const LOG_IN = 'LOG_IN'; // 액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'; 
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE'; 
export const LOG_OUT = 'LOG_OUT';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';


export const signUpAction = (data) => { // 동적으로 들어오는 데이터는 함수로 해야 함.
    return {
        type: SIGN_UP,
        data: data,
    }
};
export const loginAction = {
    type: LOG_IN,
    data: {
        nickname: '스콜',
    },
};
export const logoutAction = {
    type: LOG_OUT,
};

const reducer = (state = initialState, action) => {
    switch( action.type ) {
        case LOG_IN: {
            return {
                ...state,
                isLoggedIn: true,
                user: dummyUser,
            }
        }
        case LOG_OUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            }
        }
        case SIGN_UP: {
            return {
                ...state,
                signUpData: action.data,
            }
        }
        default: { 
            return {
                ...state,
            }
        }
    }  
};

export default reducer;