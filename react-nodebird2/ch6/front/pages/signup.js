import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  // 로그인 여부
  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  // 회원가입 완료 응답이 오면
  useEffect(() => {
    if (signUpDone) {
      Router.push('/');
    }
  }, [signUpDone]);

  // 회원가입 에러 응답이 오면
  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  // 중복되는 것들을 hooks/useInput.js 의 커스컴훅을 이용하여 중복제거.
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  // 패스워드체크는 중복체크를 하기때문에 따로 커스텀훅은 못 쓴다.
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);
  
  
  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);

    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    })

  }, [password, passwordCheck, term]);

  return (
    <>
      <AppLayout>
        <Head>
          <title>회원가입</title>
        </Head>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
          </div>
          <div>
            <label htmlFor="user-nick">닉네임</label>
            <br />
            <Input name="user-nick" value={nickname} required onChange={onChangeNickname} />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호체크</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>내 말을 잘 들을 것을 동의합니다.</Checkbox>
            {termError && <ErrorMessage style={{ color: 'red' }}>약관에 동의하셔야 합니다.</ErrorMessage>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
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

export default Signup;