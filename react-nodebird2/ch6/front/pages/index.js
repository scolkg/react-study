/* eslint-disable no-alert */
/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import wrapper from '../store/configureStore';

// 반복문 map의 두번째 index 파라미터를 key값으로 쓸 때 주의해야 한다.
// index를 쓰면 안될 때: 반복문이 바뀔 수 있는 경우, 중간에 데이터가 들어온다거나 등
// key는 고유의 값이 들어오는 게 가장 좋다.
const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  // 리트윗
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // 스크롤 내려서 가장 끝까지 갔을 때 포스트 불러오도록 하자.
  useEffect(() => {
    function onScroll() {
      // scrollY: 얼마나 내렸는지, clientHeight: 화면 보이는 길이, scrollHeight: 총 길이
      // scrollY + clientHeight = scrollHeight 이다.
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          // 마지막 게시글의 id를 구한다.
          // 만약 mainPosts가 없을 수 있으니 검사. (?)
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          console.log('lastid', lastId);
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    // window 에 addEventListener 할 때는 항상 리턴해서 remove 해줘야 한다. 안그러면 메모리에 쌓인다.
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post, index) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

// 서버사이드랜더링 하고자 하는 컴포넌트 export 위에 wrapper를 감싸준다. Home보다 먼저 실행되어야 한다.
// 그러면 알아서 백엔드에서 데이터를 가져와서 처음부터 채워준다.
// context.store.dispatch 해주는 결과를 NEXT_REDUX_WRAPPER_HYDRATE 가 받아준다.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 이건 프론트서버에서 실행되는 코드이다. 즉 요청을 브라우저에서 보내는 게 아니기 때문에
  // req.headers에 브라우저처럼 쿠키를 자동으로 구성해서 보내주지 않는다. 그래서 axios에 직접 넣어서 보내줘야 한다.
  const cookie = context.req ? context.req.headers.cookie : ''; // 프론트서버에서 실행되는 코드니까 context.req. 이용 가능

  // 실제로 쿠키를 써서 요청을 보낼 때만 넣어주고 - 쿠키를 안쓰고 요청 보낼 때는 서버에서 공유중인 쿠키를 제거해줘야 한다.
  // 이래야 다른 사람이 접속할 때 쿠키가 공유되지 않는다.
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  // request에 그치지 않고 SUCCESS 등의 응답까지 기다리려면 아래처럼 써야 한다.
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
