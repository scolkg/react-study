import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN, LOG_OUT, loginAction, logoutAction } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch(); // react-redux hooks 사용하기
  
  // 전체 state를 가져와서 구조분해로 isLoggedIn과 user를 가져온다.
  // react의 useState 가 useSelector 로 바뀌었다고 생각하면 된다.
  // 또 setState가 dispatch로 바뀌었다고 생각하면 된다.
  const { isLoggedIn, user } = useSelector( state => state.user );
  const { mainPosts } = useSelector( state => state.post );

  useEffect( () => {
/*     dispatch({
      type: LOG_IN,
      data: {
        nickname: '스콜'
      },
    });

    dispatch({
      type: LOG_OUT,
      data: {
        nickname: '스콜'
      },
    });

    dispatch({
      type: LOG_IN,
      data: {
        nickname: '스콜'
      },
    });

    dispatch( logoutAction );
    dispatch( loginAction );
    dispatch( logoutAction ); */

    dispatch({
      type: 'HELLO_SAGA',
    });
    dispatch({
      type: 'HELLO_SAGA',
    });
    dispatch({
      type: 'HELLO_SAGA',
    });

  }, [] );


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

export default Home;