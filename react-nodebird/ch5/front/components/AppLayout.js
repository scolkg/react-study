/* eslint-disable arrow-body-style */
import React from 'react';
import Link from 'next/link';
import { Menu, Input, Button } from 'antd';

// eslint-disable-next-line react/prop-types
const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/user/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </Menu.Item>
      </Menu>
      <Link href="/user/signup"><a><Button>회원가입</Button></a></Link>
      {children}
    </div>
  );
};


export default AppLayout;
