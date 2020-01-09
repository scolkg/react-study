import React, { useState, useRef } from 'react';


// 클래스의 경우 -> constructor 실행 -> 첫 랜더링 -> ref -> componentDidMount()
// -> (setState/props 바뀔 때) -> shouldComponentUpdate -> render -> componentDidUpdate
// -> 부모가 나를 없앴을 때 -> componentWillUnmount -> 소멸
// 이런게 hooks에는 없다...

const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px',
}

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
}

const computerChoice = (imgCoord) => {
  return Object.entries( rspCoords ).find( function(v){
    return v[1] === imgCoord;
  })[0];
}

const Rsp = () => {
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  const interval = useRef();

  const changeHand = () => {

  }

  const onClickBtn = (choice) => {
    
  }

}

class Rsp extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgCoord: rspCoords.바위, // 0, 142, 284
      result: 0,
      score: 0,
    }
  }

  interval;
  overlapCheck;

  shouldComponentUpdate( nextProps, nextState, nextContext){
    return true;
  }

  // 컴포넌트 첫 랜더링 후! -> 여기다가 비동기 요청을 많이 해요.
  componentDidMount() {
    this.interval = setInterval( this.changeHand, 1);
  }

  // 리랜더링
  componentDidUpdate() {
    
  }

  // 컴포넌트 제거되기 직전! - 부모가 날 없앴을 때 -> 완료되지 않은 비동기 요청 정리를 많이 해요.
  componentWillUnmount() {
    console.log('컴포넌트가 언마운트되어~ clearInterval!! 되었다!');
    clearInterval(this.interval);
  }

  changeHand = () => {
    const { imgCoord } = this.state;
    this.overlapCheck = false;
    //console.log(this.overlapCheck, imgCoord);
    if( imgCoord === rspCoords.바위 ){
      this.setState({
        imgCoord: rspCoords.가위,
      });
    }else if( imgCoord === rspCoords.가위 ){
      this.setState({
        imgCoord: rspCoords.보,
      });
    }else if( imgCoord === rspCoords.보 ){
      this.setState({
        imgCoord: rspCoords.바위,
      });
    }
  }
  
  // (choice) => () => {}  ===  onClick={ () => this.onClickBtn('가위') }
  onClickBtn = (choice) => () => {
    const { imgCoord } = this.state;

    // 먼저 연속클릭을 감지!
    if( this.overlapCheck ) {
      console.log("바뀐 다음에~ 눌러야 해!");
      return false;
    }

    // 버튼 누르면 일단 인터벌을 멈춰야 한다.
    clearInterval(this.interval);

    // 점수 계산. 내가 바위를 클릭했다면 0점, 컴퓨터가 가위라면 1점. 결과는 -1 (이긴거)
    // 또는 내가 가위를 클릭했다면 1, 컴퓨터가 보를 클릭했다면 -1. 결과는 1 - (-1) = 2 (이긴거)
    // 내가 가위를 클릭했다면 1, 컴퓨터가 바위라면 0점, 결과는 1 (진거)
    // 0은 비긴거
    const myScore = scores[choice];
    const cpuSroce = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuSroce;
    if( diff === 0 ){
      this.setState({
        result: '비겼습니다.',
      });
    }else if( [-1, 2].includes(diff) ){
      this.setState( (prevState) => {
        return {
          result: '이겼당~^^',
          score: prevState.score + 1,
        }
      });
    }else {
      this.setState( (prevState) => {
        return {
          result: '졌다 ㅜㅜ',
          score: prevState.score - 1,
        }
      });
    }

    // 모든 계산이 끝나면 연속 클릭해서 중복으로 이벤트가 발생하는 걸 방지
    this.overlapCheck = true; // true면 이미 눌렀다!
    setTimeout( () => {
      this.interval = setInterval( this.changeHand, 1);
    }, 1000);

  }

  render() {
    const { imgCoord, result, score } = this.state;
    return(
      <>
        <div id="computer" style={ { background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` } }></div>
        <div>
          <button id="scissors" className="btn" onClick={ this.onClickBtn('가위') }>가위</button>
          <button id="rock" className="btn" onClick={ this.onClickBtn('바위') }>바위</button>
          <button id="paper" className="btn" onClick={ this.onClickBtn('보') }>보</button>
        </div>
        <div><br/></div>
        <div>결과: {result}</div>
        <div>전체: {score}점</div>
      </>
    );
  }
}

export default Rsp;