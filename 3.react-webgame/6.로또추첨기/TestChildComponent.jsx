import React, { Component, PureComponent } from 'react';

class TestChildComponent extends PureComponent {
  constructor(props) {
    super(props);
    // 부모로 받은 props를 바꾸고 싶을 때 아래처럼 state를 만든 후에 그 state를 바꿔야 한다.
    this.state = {
      test: 'test',
      redo: this.props.redo,
    }
    
  }

/*   shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("false!!!");
    return false;
  } */

  onClickBtn = () => {
    this.setState( (prevState) => {
      return {
        test : prevState.test === 'test' ? 'clicked' : 'test',
        redo : 'zz',
      }
    });
  }
  

  render() {
    const { redo } = this.state;
    return (
      <>
        <div>나는 {redo+""} 상태다!</div>
        <div>나는 {this.state.test} 컴포넌트다!</div>
        <div><button onClick={this.onClickBtn}>자식 버튼</button></div>
      </>
    );
  }
}

export default TestChildComponent;