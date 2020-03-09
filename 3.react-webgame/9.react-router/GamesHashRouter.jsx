import React from 'react';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom';
import NumberBaseball from '../3.숫자야구/NumberBaseball';
import RSP from '../5.가위바위보/Rsp';
import Lotto from '../6.로또추첨기/Lotto';

const Games = () => {


  return (
    <HashRouter>
      <div>
        <Link to="/number-baseball">숫자야구</Link>
        &nbsp;
        <Link to="/rock-scissors-paper">가위바위보</Link>
        &nbsp;
        <Link to="/lotto-generator">로또</Link>
      </div>
      <div>
        <Route path="/number-baseball" component={NumberBaseball} />
        <Route path="/rock-scissors-paper" component={RSP} />
        <Route path="/lotto-generator" component={Lotto} />
        <Route path="/game/:name" component={GameMatcher} />
      </div>
    </HashRouter>
  );
}

export default Games;