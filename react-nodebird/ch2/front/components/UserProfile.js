import React from 'react';

const UserProfile = () => {
    <Card
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
}

export default UserProfile;