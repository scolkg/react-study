import React, { useState, useCallback } from 'react';
import {Form, Input, Checkbox, Button} from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { signUpAction } from '../../reducers/user';


const TextInput = ( { value } ) => {
    return (
        <div>{value}</div>
    );
}

TextInput.propTypes = {
    value: PropTypes.string,
}

// 커스텀 훅을 만들어서 반복되는 부분을 줄일 수도 있다.
export const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback( (e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
}

const Signup = () => {
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState( false );
    const [termError, setTermError] = useState( false );
    
    // useInput 커스텀훅을 만들고 id, password 등 반복되는 걸 사용
    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');
    
    const dispatch = useDispatch();

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        console.log({
            id, nick, password, passwordCheck, term,
        });
        
        if( !term ) {
            return setTermError(true);
        }

        dispatch( signUpAction({
            id,
            password,
            nick,
        }) );

    }, [password, passwordCheck, term]); // 함수내부에서 쓰는 state를 배열로 넣으서 콜백함수의 파라미터로 호출해야 함.

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck( e.target.value );
    }, [password]);

    const onChangeTerm = useCallback((e) => {
        setTermError(false);
        setTerm( e.target.checked );
    }, []);

    return <>
        <Form onSubmit={onSubmit} style={{ padding: 10 }}>
            <div><TextInput value={"145"}></TextInput></div>
            <div>
                <label htmlFor="user-id">아이디</label>
                <br />
                <Input name="user-id" value={id} required onChange={onChangeId} />
            </div>
            <div>
                <label htmlFor="user-nick">닉네임</label>
                <br />
                <Input name="user-nick" value={nick} required onChange={onChangeNick} />
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
                {passwordError && <div style={ { color: 'red' } }>비밀번호가 일치하지 않습니다.</div>}
            </div>
            <div>
                <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
                {termError && <div style={ { color: 'red'} }>약관에 동의하셔야 합니다.</div>}
            </div>
            <div style={ { marginTop: 10 } }>
                <Button type="primary" htmlType="submit">가입하기</Button>
            </div>
        </Form>
    </>
}

export default Signup;