/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { useState, useCallback, memo } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';

// 지나친 최적화의 예
const TextInput = memo(({ value, onChange }) => (

  <Input name="user-id" required value={value} onChange={onChange} />

));

TextInput.propTypes = {
  value: PropTypes.string,
};


const Signup = () => {
  // 커스텀 훅 만들기
  const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = (e) => {
      setter(e.target.value);
    };
    return [value, handler];
  };

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  // antd 컴포넌트 안에 들어가 있는 이벤트리스너들
  // state가 바뀔때마다 통째로 함수컴포넌트가 재실행되어 그에 따라 함수들이
  // 모두 새로 생성된다. 즉 자식컴포넌트에 전달되는 함수(props로 전달받는  자식컴포넌트)들은
  // 랜더링을 다시 한다는 것이다. 함수도 객체이기 때문에 이전 객체와 다른 객체가 되고
  // 말기 떄문에 리랜더링되는 것이다.
  // 그래서 자식 컴포넌트에게 props로 넘겨주는 함수는 모두 useCallback() 사용은 필수이다.

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    console.log({
      id,
      nick,
      password,
      passwordCheck,
      term,
    });
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }

    return true;
  }, [password, passwordCheck, term]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <TextInput value="aa" />
        </div>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <TextInput value={id} onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <TextInput value={nick} onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" value={password} type="password" required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 체크</label>
          <br />
          <Input name="user-password-check" value={passwordCheck} type="password" required onChange={onChangePasswordCheck} />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit">가입하기</Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
