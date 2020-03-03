import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN, LOG_OUT, loginAction, logoutAction } from '../reducers/user';


const Home = () => {
  // state는 잘게 짤라서 가져오면 좋다. (성능최적화-리랜더링을 자주 안하게끔 하니까!)
  const {user, isLoggedIn} = useSelector( state => state.user );
  const {mainPosts} = useSelector( state => state.post );

  return (
      <div>
        { user ? <div>로그인 했습니다: { user.nickname }</div> : <div>로그아웃 했습니다.</div>}
        {isLoggedIn && <PostForm /> }
          {mainPosts.map( (c) => {
            return (
                <PostCard key={c} post={c} />
            )                    
        })}
    </div>
  );
};

export default Home; // hooks 사용시