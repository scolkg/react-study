import React, { Component, PureComponent } from 'react';

class Try extends  PureComponent {
  constructor(props){
    super(props);
    
    // 부모로 받은 props를 바꾸고 싶을 때 아래처럼 state를 만든 후에 그 state를 바꿔야 한다.
    this.state = {
      result: this.props.result,
      try: this.props.try,
    };

  }

  render() {
    console.log("렌더링 Try");
    const { tryInfo } = this.props;

    return (
      <li>
        <div>{tryInfo.try}</div>
        <div>{tryInfo.result}</div>
      </li>
    );
  }
}

export default Try;