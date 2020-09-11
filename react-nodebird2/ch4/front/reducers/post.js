export const initialState = {
  mainPosts: [{
    // Images, User, Comments 등은 다른 정보랑 합쳐서 시퀄라이징하여 받는 데이터라 대문자로 통일하는 개념.
    id: 1,
    User: {
      id: 1,
      nickname: '바비',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [{
      src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
    }, {
      src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
    }, {
      src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
    }],
    Comments: [{
      User: {
        nickname: 'nero',
      },
      content: '우와~ 개정판!',
    }, {
      User: {
        nickname: 'hero',
      },
      content: '얼른 사고싶어요~',
    }],
  }],
  imagePaths: [],
  postAdded: false,
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
})

const dummyPost = {
  id: 2,
  content: '더미 데이터입니다.',
  User: {
    id: 1,
    nickname: '제로',
  },
  Images: [],
  Comments: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [
          dummyPost, // 앞에 추가해야 게시글 목록 최상단에 위치하겠지.
          ...state.mainPosts
          ],
      }
    case ADD_POST_FAILURE:
    default :
      return state;
  }
};

export default reducer;