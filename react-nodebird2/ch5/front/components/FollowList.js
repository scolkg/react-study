import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { List, Card, Button } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data }) => {
  const style = useMemo(() => ({ marginBottom: '20px' }), []);
  const dispatch = useDispatch();

  // 반복문 안에서 onclick이 있다면 반복문 내의 데이터를 넘겨줘야 해서 고차함수 쓰면 된다.
  const onCancel = (id) => () => {
    if (header === '팔로잉') {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    // 팔로워를 차단
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };

  return (
    <List
      style={style}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={<div style={{ textAlign: 'center', margin: '10px 0' }}><Button>더 보기</Button></div>}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: '20px' }}>
          <Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
