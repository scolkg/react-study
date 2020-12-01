import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';

import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.me?.id); // 유저 id는 reducer(useSelector) 에서 가져오고
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);

  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      // useInput 이란 커스텀훅을 썼기 때문에 useInput 에 3번째 인자를 추가한다.
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button
          style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
        >삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
  })
};

export default CommentForm;