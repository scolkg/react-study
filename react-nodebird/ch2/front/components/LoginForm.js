import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useInput } from '../pages/user/signup';

const LoginForm = () => {

    const [id, setId] = useInput('');
    const [password, setPassword] = useInput('');

    return (
        <Form>
            <div>
                <label htmlFor="user0-id">아이디</label>
                <br />
                <Input name="user-id"  required />
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input name="user-password" type="password" required />
            </div>
            <div>
                <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </div>
        </Form>
    );
}

export default LoginForm;