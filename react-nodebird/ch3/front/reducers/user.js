/** 
 * Redux -> React의 state는 쓰지 않아도 돼요.
 * 안정성, state 통제 용이.
 * 단점: 코드가 많아짐.
*/
// store
export const initialState = {
    isLoggedIn: false,
    user: {},
};

export const LOG_IN = 'LOG_IN'; // 액션의 이름
export const LOG_OUT = 'LOG_OUT';

// action -> state를 바꾸는 행동
export const loginAction = {
    type: LOG_IN,
    data: {
        nickname: '스콜',
    },
};
export const logoutAction = {
    type: LOG_OUT,
};

// reducer -> action의 결과로 state를 어떻게 바꿀지 정의
const reducer = (state = initialState, action) => {
    switch( action.type ) {
        case LOG_IN: {
            return {
                ...state,
                isLoggedIn: true,
                user: action.data,
            }
        }
        case LOG_OUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null,
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