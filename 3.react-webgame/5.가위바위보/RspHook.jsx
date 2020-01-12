import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px',
};

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
};

const computerChoice = (imgCoord) => {
  return Object.entries(rspCoords).find(function(v) {
    return v[1] === imgCoord;
  })[0];
};

// 클래스는 가로 사이클, 훅스는 세로단위로 처리. (한번에 묶일 수도 있구)
//                        result, imgCoord, score
// componentDidMount
// componentDidUpdate
// componentWillUnmount

// componentDidMount() {
//   this.setState({
//     imgCoord: 3,
//     score: 1,
//     result: 2,
//   })
// }

// useEffect(() => {
//   setImgCoord();
//   setScore();
// }, [imgCoord, score]);
// useEffect(() => {
//   setResult();
// }, [result]);

const Rsp = () => {
  const [result, setResult] = useState('');
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef();
  const overlapCheck = useRef();

  useEffect( () => { // componentDidMount, componentDidUpdate 을 합쳐 놓은 역할 (1대1 대응은 아님)
    //console.log('다시 실행');
    interval.current = setInterval(changeHand, 100);

    return () => { // 이 리턴이 componentWillUnmount 역할
      //console.log('종료');
      clearInterval( interval.current );
    }
  
    // 이 두번째 인수인 배열이 클로져 문제를 해결해 준다. 이 배열 값이 바뀔 때마다 useEffect가 다시 실행.
    // 배열안을 비워두면 뭐가 바뀌든지 신경쓰지 않고 최초 한번만 실행하겠다.
    // 즉 비워두면 componentDidMount역할. 값을 넣는다면 componentDidUpdate 역할을 하는 것!
  }, [ imgCoord ]); 

  useLayoutEffect( () => {
    //console.log("화면 리사이징 감지???");
  }, []);

  const changeHand = () => {
    overlapCheck.current = false;
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위);
    }
  };

  const onClickBtn = (choice) => () => {
    // 먼저 연속클릭을 감지!
    if( overlapCheck.current ) {
      console.log("바뀐 다음에~ 눌러야 해!");
      return false;
    }

    clearInterval(interval.current);
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;
    if (diff === 0) {
      setResult('비겼습니다!');
    } else if ([-1, 2].includes(diff)) {
      setResult('이겼습니다!');
      setScore((prevScore) => prevScore + 1);
    } else {
      setResult('졌습니다!');
      setScore((prevScore) => prevScore - 1);
    }
    
    // 모든 계산이 끝나면 연속 클릭해서 중복으로 이벤트가 발생하는 걸 방지
    overlapCheck.current = true; // true면 이미 눌렀다!
    setTimeout(() => {
      interval.current = setInterval(changeHand, 100);
    }, 1000);
  };

  return (
    <>
      <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn('바위')}>바위</button>
        <button id="scissor" className="btn" onClick={onClickBtn('가위')}>가위</button>
        <button id="paper" className="btn" onClick={onClickBtn('보')}>보</button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};

export default Rsp;
