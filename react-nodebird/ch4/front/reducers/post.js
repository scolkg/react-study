// store
export const initialState = {
    mainPosts: [{
        User: {
            id: 1,
            nickname: '제로초',
        },
        content: '첫 번째 게시글',
        img: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
    }],
    imagePaths: [],
};

// action name
export const ADD_POST = 'ADD_POST';
export const ADD_DUMMY = 'ADD_DUMMY';

// action -> state를 바꾸는 행동
export const addPost = {
    type: ADD_POST,
};
export const addDummy = { 
    type: ADD_DUMMY,
    data: {
        content: 'Hello Redux',
        UserId: 1,
        User: {
            nickname: '스콜',
        },
    },
};

// reducer -> action의 결과로 state를 어떻게 바꿀지 정의
const reducer = (state = initialState, action) => {
    switch( action.type ) {
        case ADD_POST: {
            return {
              // 새로운 객체나 배열을 생성하는 문법 (스프레드) -> 불변성을 위함. (예전 값이랑 지금 값이랑 달라졌는지)
              // 객체나 배열은 값을 참조하기 때문에 리액트가 달라졌는지 알아채지 못하여 달라진 걸 알아차리게 하려면 이렇게 새롭게 객체나 배열을 생성해줘야 한다.
              ...state  
            }
        }
        case ADD_DUMMY: {
            return {
                ...state,
                mainPosts: [action.data, ...state.mainPosts],
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
}

export default reducer;