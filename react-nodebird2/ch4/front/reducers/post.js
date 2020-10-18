import shortId from 'shortid';
import produce from 'immer';
import faker from 'faker';

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true, // 더이상 포스트를 가져올지 안가져올지 정해주는 변수, 처음엔 10개 가져오므로 true
  loadPostsLoading: false, // 포스트들 로드 시도중
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false, // 포스트 추가 시도중
  addPostDone: false,
  addPostError: null,
  removePostLoading: false, // 포스트 삭제 시도중
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false, // 댓글 추가 시도중
  addCommentDone: false,
  addCommentError: null,
};

/*
initialState.mainPosts = initialState.mainPosts.concat(
  Array(20).fill().map(() => ({
    id: shortId.generate(),
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.paragraph(),
    Images: [{
      src: faker.image.imageUrl(),
    }],
    Comments: [{
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.sentence(),
    }],
  })),
);
*/

// 인피니트스크롤링을 위해 사가에서 쓰기 위해 데이터 가져오는 부분을 함수로 만들어서
// 사가에서 호출해보자
export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortId.generate(),
  User: {
    id: shortId.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

// 동적 액션 크리에이터 (액션을 그때그때 생성해주는 크리에이터)
export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: '제로',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(), // 랜덤한 id를 자동으로 만들어주는 shortId 라이브러리.
  content: data,
  User: {
    id: 1,
    nickname: '제로@@',
  },
});

// reducer란 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수! (단, 불변성을 지키면서!) ...이 필요없다!
const reducer = (state = initialState, action) => produce(state, (draft) => {
  // immer를 쓰면 불변성을 지키지 않아야 한다! 알아서 immer가 처리하기 때문에!
  switch (action.type) {
    case LOAD_POSTS_REQUEST:
      draft.loadPostsLoading = true;
      draft.loadPostsDone = false;
      draft.loadPostsError = null;
      break;
    case LOAD_POSTS_SUCCESS:
      draft.loadPostsLoading = false;
      draft.loadPostsDone = true;
      draft.mainPosts = action.data.concat(draft.mainPosts);
      // console.log('mainPosts.length', action.data.concat(draft.mainPosts).length);
      // 50개 이상이 되면 더이상 안가져오겠다.
      draft.hasMorePosts = draft.mainPosts.length < 50;
      break;
    case LOAD_POSTS_FAILURE:
      draft.loadPostsLoading = false;
      draft.loadPostsError = action.error;
      break;
    case ADD_POST_REQUEST:
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostError = null;
      break;
    case ADD_POST_SUCCESS:
      draft.addPostLoading = false;
      draft.addPostDone = true;
      draft.mainPosts.unshift(dummyPost(action.data));
      break;
    case ADD_POST_FAILURE:
      draft.addPostLoading = false;
      draft.addPostError = action.error;
      break;
    case REMOVE_POST_REQUEST:
      draft.removePostLoading = true;
      draft.removePostDone = false;
      draft.removePostError = null;
      break;
    case REMOVE_POST_SUCCESS:
      draft.removePostLoading = false;
      draft.removePostDone = true;
      // 불변성을 안지키기 위해선 사실 filter보다 slice를 사용해야 옳긴 하다
      draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
      break;
    case REMOVE_POST_FAILURE:
      draft.removePostLoading = false;
      draft.removePostError = action.error;
      break;
    case ADD_COMMENT_REQUEST:
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS: {
      // saga에서 넘어온 content, postId, id 를 어떻게 해당되는 post를 찾아서 넣냐면
      // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
      // const post = { ...state.mainPosts[postIndex] }; // 찾은 index로 해당되는 post를 찾는다. 얕은 복사가 되니
      // post.Comments = [dummyComment(action.data.content), ...post.Comments]; // 불변성때문에 새로운 객체로 만듬
      // const mainPosts = [...state.mainPosts]; // 먼저 mainPosts부터 새로운 객체를 만들어주고
      // mainPosts[postIndex] = post; // 해당되는 post도 새로운 객체를 만들어준다.
      // 불변성은 바뀌는 것만 바뀌고 안바뀌는 데이터들은 그대로 참조를 유지해주는 것. 그래야 메모리도 절약할 수 있다.
      // 근데 위 방법은 매우 가독성이 어렵다. 그래서 이 불변성을 위한 라이브러리인 이머를 쓴다.

      // immer를 쓰면 간단하다 불변성 필수템! 두 줄로 끝!
      const post = draft.mainPosts.find((v) => v.id === action.data.postId);
      post.Comments.unshift(dummyComment(action.data.content));
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      break;
    }
    case ADD_COMMENT_FAILURE:
      draft.addCommentLoading = false;
      draft.addCommentError = action.error;
      break;
    default:
      break;
  }
});

/*
// reducer란 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수! (단, 불변성을 지키면서!)
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [
          dummyPost(action.data), // 앞에 추가해야 게시글 목록 최상단에 위치하겠지.
          ...state.mainPosts,
        ],
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
      };
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        // 지울 땐 보통 filter() 로 불변성 지키면서 지워준다.
        mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
        removePostLoading: false,
        removePostDone: true,
      };
    case REMOVE_POST_FAILURE:
      return {
        ...state,
        removePostLoading: false,
        removePostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS: {
      // saga에서 넘어온 content, postId, id 를 어떻게 해당되는 post를 찾아서 넣냐면
      // 먼저 index를 찾고 (id)
      const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
      // 찾은 index로 해당되는 post를 찾는다. 얕은 복사가 되니 불변성을 지켜야 하므로 새로운 객체로 만들어 준다
      const post = { ...state.mainPosts[postIndex] }; 
      post.Comments = [dummyComment(action.data.content), ...post.Comments]; // 이렇게 하면 얕은 복사가 되니 
      // 불변성을 지키기 위해 새로운 객체를 만들어줘야 한다.
      const mainPosts = [...state.mainPosts]; // 먼저 mainPosts부터 새로운 객체를 만들어주고
      mainPosts[postIndex] = post; // 해당되는 post도 새로운 객체를 만들어준다.
      // 불변성은 바뀌는 것만 바뀌고 안바뀌는 데이터들은 그대로 참조를 유지해주는 것. 그래야 메모리도 절약할 수 있다.
      // 근데 위 방법은 매우 가독성이 어렵다. 그래서 이 불변성을 위한 라이브러리인 이머를 쓴다.
      // immer를 쓰면 간단하다 불변성 필수템!

      return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};
*/

export default reducer;
