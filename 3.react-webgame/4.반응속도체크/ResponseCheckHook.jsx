import React, { useState, useRef, memo } from 'react';

const ResponseCheckHook = () => {
  const [state, setState] = useState('waiting');
  const [message, setMessage] = useState('클릭해서 시작하세요.');
  const [result, setResult] = useState( [] );

  // hooks에서는 this의 속성들은 ref로 표현해야 한다.
  // ref를 쓰면 return (렌더링) 되지 않아서 좋다. state는 바뀔때마다 렌더링..
  const timeout = useRef(null);
  const startTime = useRef(0);
  const endTime = useRef(0);

  const onClickScreen = () => {
    if( state === 'waiting' ) { // 대기 단계에 클릭했을 때
      setState('ready');
      setMessage('ready: 초록색이 되면 클릭하시오');
      timeout.current = setTimeout( () => {
        setState('now');
        setMessage('now: 지금 클릭!!!');
        startTime.current = new Date(); // 시작시간과 끝시간은 state일 필요 없다. (불필요한 랜더링이 되므로)
      }, Math.floor( Math.random() * 1000 ) + 2000 ); // 2~3초 랜덤
    
    }else if( state === 'ready' ) { // 준비 단계에 클릭했을 때 (성급하게 클릭)
      clearTimeout(timeout.current); // 기존의 실행중인 setTimeout()을 초기화
      setState('waiting');
      setMessage('waiting: 이런! 성급했군요~');

    }else if( state === 'now' ) { // 타이밍 맞게 클릭했을 때 (반응속도 체크)
      endTime.current = new Date();
      const resultTime = endTime.current - startTime.current;
      console.log(resultTime);
      
      setState('waiting');
      setMessage('waiting: 클릭해서 시작하세요@');
      setResult( (prevResult) => {
        return [...prevResult, resultTime];
      });
    }
  }

  const resetClick = () => {
    clearTimeout(timeout.current);
    setResult([]);
    setState('waiting');
    setMessage('waiting: 클릭해서 다시 시작-리셋!');
  }

  const renderAverage = () => {
    return result.length === 0
    ? null
    : <>
        <div>평균 시간: { result.reduce( (a, c) => a + c) / result.length }ms</div>
        <button onClick={resetClick}>리셋</button>
      </>
  }


  return (
    <>
        <div 
          id="screen" 
          className={state}
          onClick={onClickScreen}
        >
          {message}
        </div>
        {(() => {
            // if문 쓰는 방법 - 즉시실행함수로 만들어야 함.
            if( result.length === 0 ){
              console.log("fuck");
            }else{
              console.log("result.length-> " , result.length)
            }
          }
        )()}

        {renderAverage()}
      </>
  );
}

export default ResponseCheckHook;