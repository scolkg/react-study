import React from 'react';
import { useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

// 반복문 map의 두번째 index 파라미터를 key값으로 쓸 때 주의해야 한다. 
// index를 쓰면 안될 때: 반복문이 바뀔 수 있는 경우, 중간에 데이터가 들어온다거나 등
// key는 고유의 값이 들어오는 게 가장 좋다.
const Home  = () => {
  const { logInDone } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  return (
    <AppLayout>
      {logInDone && <PostForm />}
      {mainPosts.map((post, index) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

export default Home;