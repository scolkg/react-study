import React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
  // 더미 데이터
  const followerList = [{nickname: '제로초'}, {nickname: '야노드'}, {nickname: '굳굳'}];
  const followingList = [{nickname: '빨로미'}, {nickname: '배백'}, {nickname: '제로초'}];

  return (
    <>
      <Head>
        <title>프로필</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followerList} />
        <FollowList header="팔로워 목록" data={followingList} />
      </AppLayout>
    </>
  )
};

export default Profile;