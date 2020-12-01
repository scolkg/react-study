import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

// 이 map에서 key는 i(인덱스)를 써도 된다. 사용자 의도가 없으면 절대 바뀔리가 없는 얘이기 때문에
const PostCardContent = ({ postData }) => ( // 첫 번째 게시글 #해시태그 #해시태그
  <div>
    {postData.split(/(#[^\s#]+)/g).map((v, i) => {
      if (v.match(/(#[^\s#]+)/)) {
        return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
      }
      return v;
    })}
  </div>
);

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
