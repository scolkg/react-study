import React, { Component, memo, useState } from 'react';

// hooks에서는 memo로 감싸주기만 하면 된다.

const Try = memo( ( { tryInfo } ) => {
  // 부모로 받은 props를 바꾸고 싶을 때 아래처럼 state를 만든 후에 그 state를 바꿔야 한다.
  const [result, setResult] = useState(tryInfo.result);

  const onClick = () => {
    setResult('자식에서 setResult 변경');
  }

  return (
    <li>
      <div>{tryInfo.try}</div>
      <div onClick={onClick}>{result}</div>
    </li>
  );
});


export default Try;