import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

////import { useDispatch, useSelector } from 'react-redux';
// react redux hooks를 사용할 수 없을 때는 이렇게 connect로 하이오더 컴포넌트로 만들어서 썼다.
// 보통 class 컴포넌트를 사용할 때는 connect를 이용한 하이오더 컴포넌트 방법으로 쓰고
// 함수형 컴포넌트는 useDispatch, useSelector 등의 훅스를 이용하여 쓴다.
import { connect } from 'react-redux';

import { LOG_IN, LOG_OUT, loginAction, logoutAction } from '../reducers/user';

const dummy = {
    isLoggedIn: true,
    imagePaths: [],
    mainPosts: [{
      User: {
        id: 1,
        nickname: '제로초',
      },
      content: '첫 번째 게시글',
      img: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
    }],
  };

const Home = ( { user, dispatch, login, logout } ) => {
  //// const dispatch = useDispatch();
  //// const { user } = useSelector(state => state.user);
  
  useEffect( () => {
    login();
    logout();
    login();
    logout();
  }, [] );


    return (
        <div>
          { user ? <div>로그인 했습니다: { user.nickname }</div> : <div>로그아웃 했습니다.</div>}
          {dummy.isLoggedIn && <PostForm /> }
           {dummy.mainPosts.map( (c) => {
              return (
                  <PostCard key={c} post={c} />
              )                    
          })}
      </div>
    );
};

// react state를 redux state로 1:1 매치를 시켜주는 함수
function mapStateToProps( state ) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps( dispatch ) {
  return {
    login: () => dispatch(loginAction),
    logout: () => dispatch(logoutAction),
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Home);