import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

// hook을 지원하기전에는 하이오더 컴포넌츠로 구현했었음. 아래처럼
// import { useDispatch, useSelector } from 'react-redux';
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

const Home = ({ user, dispatch, login, logout }) => {
  // const dispatch = useDispatch();
  
  // 전체 state를 가져와서 구조분해로 isLoggedIn과 user를 가져온다.
  // const { isLoggedIn, user} = useSelector( state => state.user );


  useEffect( () => {
    login();
    logout();
    login();

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

function mapStateToProps(state){
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch){
  return {
    login: () => dispatch( loginAction ),
    logout: () => dispatch( logoutAction ),
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Home);
// export default Home; // hooks 사용시