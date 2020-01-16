import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import Ball from './BallFunc';


function getWinNumbers() {
  console.log('getWinNumbers()');
  const candidate = Array(45).fill().map( (v, i) => i + 1 );
  const shuffle = [];
  while( candidate.length > 0 ){
    let randomNum = candidate.splice( Math.floor( Math.random() * candidate.length ), 1 );
    shuffle.push( parseInt(randomNum) );
  }
  const bonusNumber = shuffle[ shuffle.length -1 ];
  const winNumbers = shuffle.slice(0, 6).sort( (p, c) => p - c );

  return [...winNumbers, bonusNumber];
}

const LottoHooks = memo( () => {
  const [winBalls, setWinBalls] = useState([]);
  // 두번째 인자 배열이 바뀌면 다시 실행된다. 안넣으면 실행 안됨.
  const lottoNumbers = useMemo( () => getWinNumbers(), []); 
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  // useMemo: 복잡한 함수 결과값을 기억
  // useCallback: 복잡한 함수 자체를 기억
  // useRef: 일반 값을 기억

  useEffect( () => {
    console.log('useEffect');
    // let을 쓰면 클로져 문제가 생기지 않는다. (es6오면서 편해진 점)
    for( let i = 0 ; i < winNumbers.length-1 ; i ++ ){
      // 이때 timeouts가 바뀌는게 아니다. current를 직접 바꾸는게 아니라 배열의 요소로 집어넣는 것이기 때문에.
      timeouts.current[i] = setTimeout( () => {
        setWinBalls( (prevBalls) => [...prevBalls, winNumbers[i]] );
      }, (i + 1 ) * 500);
    }
    timeouts.current[6] = setTimeout( () => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 3500);
  }, [timeouts.current]); // inputs 배열이 비어있으면 componentDidMount()랑 똑같은 역할.
  // 배열에 요소가 있으면 componentDidMount랑 componentDidUpdate 를 다 수행.



  /* 함수 생성 자체 시간이 넘 오래걸릴 때 이렇게 useCallback으로 함수를 기억해서 시간을 줄일 수 있다.
  그렇다면 모든 함수에 useCallback을 쓰면 좋을 순 있지만 아닐 경우도 있다.
  어떨 때 문제가 생기냐면 console.log(winNumbers)에서 winNumbers를 기억하고 있어서
  windNumbers가 바뀌어도 과거의 값을 가지고 있기 때문에 이 값을 응용할 때 문제가 생긴다.
  
  useCallback을 필수로 적용해야 할 때
  - Ball같은 자식 컴포넌트에 props로 함수를 넘길 때는 꼭 useCallback을 써야한다.
  useCallback이 없으면 매번 새로운 함수가 생성되는데 자식컴포넌트는 매번 함수가 생성되니까
  바뀐지 알고 쓸데없이 리랜더링되는 문제가 있다. 그래서 써야 함.
  */
  const onClickRedo = useCallback(() => {
    console.log("onClickRedo");
    console.log(winNumbers);
    setWinNumbers( getWinNumbers() );
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]); // 그래서 이렇게 배열 인자에 winNumbers를 넣어주면 winNumbers 값이 바뀌면 기억을 다시 한다.

  return (
    <>
        <div>로또 숫자</div>
        <div id="result">
          { winBalls.map( (v) => <Ball key={v} number={v} /> ) }
        </div>
        <div>보너스!</div>
        { bonus && <Ball number={bonus} /> }
        { redo && <button onClick={ onClickRedo }>한 번 더!</button> }
      </>
  );
});

export default LottoHooks;