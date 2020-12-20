import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  /* - 리듀서도 많고 액션도 너무 많다. 그래서 나온 것이 swr이다.
  - npm i swr (next에서 만든 라이브러리이다)
  - 단점은 서버사이드랜더링이 힘들다. 그래서 SSR이 필요없는 곳에서 쓰자.
  - 예를 들면 프로필에서 팔로우나 팔로잉 데이터를 가져올 때 써도 좋다.
  - 서버사이드랜더링 쓰는 목적은 검색엔진에 노출시키기 위해 그리고 로딩 속도 빠르게 하기 위함인데 프로필 데이터들은 검색엔진에 노출시킬 필요가 없으니까. */
  // 이것도 훅이다. fetcher는 이 주소를 어떻게 실재로 가져올 것인지에 대한 것이다.
  // axios로 가져오니까 위에 fetcher = ... 처럼 가져온다.
  // data나 error 둘 다 없으면 로딩중이고 둘 중 하나라도 있으면 성공이거나 실패이다.
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);

  // swr사용으로 필요없어지게 된다.
  /* useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []); */

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return <div>내 로그인 정보가 없습니다.</div>;
  }

  // 어떤 경우에도 return이 컴포넌트의 모든 훅스(useCallback, useEffect 등)보다 위에 있을 수 없다.
  // 무조건 리턴은 모든 훅스 호출 후에 위치시켜야 한다.
  // const { me } ... 가 첫번째 훅스 const { data: ...} 두 줄이 2,3번 훅스, useEffect 가 4번 훅스.
  // 즉 4번까지 모든 훅스가 실행되고 나서 리턴소스가 와야함. 안그러면 에러 발생시킨다.
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }

  return (
    <>
      <Head>
        <title>프로필</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followingsData && !followingError} />
      </AppLayout>
    </>
  );
};

// 서버사이드랜더링 하고자 하는 컴포넌트 export 위에 wrapper를 감싸준다. Home보다 먼저 실행되어야 한다.
// 그러면 알아서 백엔드에서 데이터를 가져와서 처음부터 채워준다.
// context.store.dispatch 해주는 결과를 NEXT_REDUX_WRAPPER_HYDRATE 가 받아준다.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');

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
  // request에 그치지 않고 SUCCESS 등의 응답까지 기다리려면 아래처럼 써야 한다.
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Profile;