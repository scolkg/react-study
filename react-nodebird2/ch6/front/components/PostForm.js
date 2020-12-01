import React, { useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';

import { addPost, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const dispatch = useDispatch();

  const { imagePaths, addPostDone } = useSelector((state) => state.post);

  /* const [text, setText] = useState(''); // 이런 건 useInput() 커스텀훅을 사용하자.
  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);
  */

  // 이거 한 줄이면 끝.
  const [text, onChangeText, setText] = useInput('');

  // 짹짹이 성공했을 때 (addPostDone) 만 댓글창을 비워준다.
  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      // eslint-disable-next-line no-alert
      return alert('게시글을 작성하세요.');
    }
    // dispatch(addPost(text));
    // hooks를 쓰면 굳이 addPost() 같은 action 함수보다 이렇게 직접 dispatch 바로 하는게 효율적.
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', text);

    // 정보: 멀티파트가 아니고 텍스트 데이터면 req.body.image, req.body.content가 된다.
    // 이미지나 파일은 req.files 나 req.images 등으로 접근!
    // 그런데 굳이 이미지 파일이 올라가는 게 아니므로 json으로 보내야 더 효율적.
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    // e.target.files 가 유사배열 (배열이 아님)이기 떄문에 배열의 forEach().call()로 진짜 배열로 만들어준다.
    [].forEach.call(e.target.files, (f) => {
      // append('키', '밸류');
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  // 반복분 내의 이벤트의 파라미터를 처리하기 위해서는 고차함수를 써야 한다.
  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}> 
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
