import React, { Component, PureComponent } from 'react';

class TicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '틱택토'
    }
  }

  render() {
    const { test } = this.state;
    return (
      <>
        <div>Hello {test}</div>
      </>
    );
  }
}

export default TicTacToe;

