import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Form, Menu, Input, Button, Row, Col, Card, Avatar } from 'antd';
import LoginForm from './LoginForm';

const dummy = {
    nickname: '스콜',
    Post: [],
    Followings: [],
    Followers: [],
    isLoggedIn: false,
}

const AppLayout = ( {children} ) => {
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
                <Menu.Item key="mail">
                    <Input.Search enterButton style={ { verticalAlign: 'middle'} } />
                </Menu.Item>
            </Menu>
            <Link href="/user/signup"><a><Button>회원가입</Button></a></Link>
            <Row>
                <Col xs={24} md={6} >
                    { dummy.isLoggedIn 
                        ? <Card
                        actions={[
                            <div key="twit">짹쨱<br />{dummy.Post.length}</div>,
                            <div key="following">팔로잉<br />{dummy.Followings.length}</div>,
                            <div key="follower">팔로워<br />{dummy.Followers.length}</div>,
                        ]}
                    >
                        <Card.Meta
                            avatar={<Avatar>{ dummy.nickname[0] }</Avatar>}
                            title={dummy.nickname}
                        />
                    </Card>
                    :
                    <LoginForm />
                    }
                </Col>
                <Col xs={24} md={12} >두번째</Col>
                <Col xs={24} md={6} >세번째</Col>
            </Row>
            { children }
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node,
}

export default AppLayout;