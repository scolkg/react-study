import React, { Component } from 'react';


class ResponseCheck extends Component {
  state = {
    state: 'waiting',
    message: '클릭해서 시작하세요.',
    result: [],
  };

  timeout;
  startTime;
  endTime;

  onClickScreen = () => {
    const { state, message, result } = this.state;
    if( state === 'waiting' ) { // 대기 단계에 클릭했을 때
      this.setState({
        state: 'ready',
        message: 'ready: 초록색이 되면 클릭하세요',
      });
      this.timeout = setTimeout( () => {
        this.setState({
          state: 'now',
          message: 'now: 지금 클릭!!',
        });
        this.startTime = new Date(); // 시작시간과 끝시간은 state일 필요 없다. (불필요한 랜더링이 되므로)
      }, Math.floor( Math.random() * 1000 ) + 2000 ); // 2~3초 랜덤
    
    }else if( state === 'ready' ) { // 준비 단계에 클릭했을 때 (성급하게 클릭)
      clearTimeout(this.timeout); // 기존의 실행중인 setTimeout()을 초기화
      this.setState({
        state: 'waiting',
        message: 'waiting: 이런! 성급하셨군요...',
      })
      
    }else if( state === 'now' ) { // 타이밍 맞게 클릭했을 때 (반응속도 체크)
      this.endTime = new Date();
      const resultTime = this.endTime - this.startTime;
      console.log(resultTime);
      
      this.setState( (prevState)  => {
        return {
          state: 'waiting',
          message: 'waiting: 클릭해서 시작하세요!',
          result: [...prevState.result, resultTime],
        };
      })
    }
  }

  resetClick = () => {
    clearTimeout(this.timeout);
    this.setState({
      result: [],
      state: 'waiting',
      message: 'waiting: 클릭해서 시작-리셋',
    });
  }

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 
    ? null 
    : <>
      <div>평균 시간: { result.reduce( (a, c) => a + c ) / result.length }ms</div>
      <button onClick={this.resetClick}>리셋</button>
      </>
  }


  render(){
    const { state, message } = this.state;

    return (
      <>
        <div 
          id="screen" 
          className={state}
          onClick={this.onClickScreen}
        >
          {message}
        </div>
        {this.renderAverage()}
      </>
    );
  }
}

export default ResponseCheck;