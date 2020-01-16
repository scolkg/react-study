import React, { Component, PureComponent } from 'react';
import Ball from './Ball';
import TCP from './TestChildComponent';

function getWinNumbers() {
  console.log('getWinNumbers()');
  const candidate = Array(45).fill().map( (v, i) => i + 1 );
  const shuffle = [];
  while( candidate.length > 0 ){
    let randomNum = candidate.splice( Math.floor( Math.random() * candidate.length ), 1 );
    shuffle.push( randomNum );
  }
  const bonusNumber = shuffle[ shuffle.length -1 ];
  const winNumbers = shuffle.slice(0, 6).sort( (p, c) => p - c );

  return [...winNumbers, bonusNumber];
}

class Lotto extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      winNumbers: getWinNumbers(), // 당첨 숫자들
      winBalls: [],
      bonus: null, // 보너스 공
      redo: false,
    };
  }

/*   shouldComponentUpdate( nextProps, nextState, nextContext ){
    console.log('shouldComponentUpdate');
    return true;
  } */

  timeouts = [];

  runTimeouts = () => {
    const { winNumbers } = this.state;
    // let을 쓰면 클로져 문제가 생기지 않는다. (es6오면서 편해진 점)
    for( let i = 0 ; i < this.state.winNumbers.length-1 ; i ++ ){
      this.timeouts[i] = setTimeout( () => {
        this.setState( (prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]],
          }
        });
      }, (i + 1 ) * 500);
    }
    this.timeouts[6] = setTimeout( () => {
      this.setState( {
        bonus: winNumbers[6],
        redo: true,
      });
    }, 3500);
  }

  componentDidMount() {
    console.log('componentDidUpdate');
    this.runTimeouts();
  }

  componentDidUpdate(prevProps, prevState) {
    // 이전 스테이트와 현재 스테이트를 비교하여 처리함. 그래야 필요할 때만 처리.
    if( this.state.winBalls.length === 0 ) {
      console.log("componentDidUpdate() : runTimeouts()" );
      this.runTimeouts();
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach( (v) => {
      clearTimeout(v);
    });
  }

  onClickRedo = () => {
    this.setState({
      winNumbers: getWinNumbers(), // 당첨 숫자들
      winBalls: [],
      bonus: null, // 보너스 공
      redo: false,
    });
    this.timeouts = [];
  }

  render() {
    const { winBalls, bonus, redo, gun } = this.state;
    return (
      <>
        <div>로또 숫자</div>
        <div id="result">
          { winBalls.map( (v) => <Ball key={v} number={v} /> ) }
        </div>
        <div>보너스!</div>
        { bonus && <Ball number={bonus} /> }
        { redo && <button onClick={ this.onClickRedo }>한 번 더!</button> }
        <TCP gun={gun} redo={redo} />
      </>
    );
  }
}

export default Lotto;