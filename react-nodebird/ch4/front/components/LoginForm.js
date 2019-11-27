import React, { useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useInput } from '../pages/user/signup';
import { loginAction } from '../reducers/user';

const LoginForm = () => {
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    const dispatch = useDispatch();

    // useCallback 으로 감싸는 기준은 자식컴포넌트에 넘기는 함수는 무조건 감싸준다.
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log({
            id, password
        });

        dispatch( loginAction );

    }, [id, password]);

    return (
        <Form onSubmit={onSubmitForm} style={ {padding: '10px'} }>
            <div>
                <label htmlFor="user0-id">아이디</label>
                <br />
                <Input name="user-id" value={id} onChange={onChangeId}  required />
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
            </div>
            <div style={ {marginTop: '10px'} }>
                <span><Button type="primary" htmlType="submit" loading={false}>로그인</Button></span>
                <span><Link href="/user/signup"><a><Button>회원가입</Button></a></Link></span>
            </div>
        </Form>
    );
}

export default LoginForm;