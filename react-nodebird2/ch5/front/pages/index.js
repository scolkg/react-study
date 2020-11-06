/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

// 반복문 map의 두번째 index 파라미터를 key값으로 쓸 때 주의해야 한다.
// index를 쓰면 안될 때: 반복문이 바뀔 수 있는 경우, 중간에 데이터가 들어온다거나 등
// key는 고유의 값이 들어오는 게 가장 좋다.
const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  // 배열이 빈 값이면 componentDidMount()와 같은 역할! 그래서 초기 한번만 dispatch함!
  useEffect(() => {
    // 유저 정보 가져오기
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    // 게시글 불러오기
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  // 스크롤 내려서 가장 끝까지 갔을 때 포스트 불러오도록 하자.
  useEffect(() => {
    function onScroll() {
      // scrollY: 얼마나 내렸는지, clientHeight: 화면 보이는 길이, scrollHeight: 총 길이
      // scrollY + clientHeight = scrollHeight 이다.
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
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

export default Home;
