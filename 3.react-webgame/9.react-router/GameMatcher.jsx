import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NumberBaseball from '../3.숫자야구/NumberBaseball';
import RSP from '../5.가위바위보/Rsp';
import Lotto from '../6.로또추첨기/Lotto';

class GameMatcher extends Component {
  
  render() {
    let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
    console.log(urlSearchParams.get('hello'));

    if (this.props.match.params.name === 'number-baseball') {
      return <NumberBaseball />
    } else if (this.props.match.params.name === 'rock-scissors-paper') {
      return <RSP />
    } else if (this.props.match.params.name === 'lotto-generator') {
      return <Lotto />
    }
    return (
      <div>
        일치하는 게임이 없습니다.
      </div>
    );
  }
}

export default GameMatcher;