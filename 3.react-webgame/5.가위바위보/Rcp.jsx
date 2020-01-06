import React, { Component } from 'react';


// 클래스의 경우 -> constructor 실행 -> 첫 랜더링 -> ref -> componentDidMount()
// -> (setState/props 바뀔 때) -> shouldComponentUpdate -> render -> componentDidUpdate
// -> 부모가 나를 없앴을 때 -> componentWillUnmount -> 소멸

class Rcp extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgCoord: '', // 0, 142, 284
      result: '',
      score: '',
    }
  }

  testInterval;

  // 컴포넌트 첫 랜더링 후! -> 여기다가 비동기 요청을 많이 해요.
  componentDidMount() {
    this.testInterval = setInterval( () => {
      console.log("1초마다 setInterval()");
    }, 1000);
  }

  // 리랜더링
  componentDidUpdate() {
    
  }

  // 컴포넌트 제거되기 직전! - 부모가 날 없앴을 때 -> 완료되지 않은 비동기 요청 정리를 많이 해요.
  componentWillUnmount() {
    clearInterval(this.testInterval);
  }

  onClickBtn = (e) => {
    console.log(e);
  }

  render() {
    const { imgCoord, result, score } = this.state;
    return(
      <>
        <div id="" style={ { background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` } }></div>
        <div>
          <button id="scissors" className="btn" onClick={ () => this.onClickBtn('가위') }>가위</button>
          <button id="rock" className="btn" onClick={ () => this.onClickBtn('바위') }>바위</button>
          <button id="paper" className="btn" onClick={ () => this.onClickBtn('보') }>보</button>
        </div>
        <div><br/></div>
        <div>결과: {result}</div>
        <div>전체: {}점</div>
      </>
    );
  }
}

export default Rcp;