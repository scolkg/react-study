import React from 'react';
import { BrowserRouter, HashRouter, Route, Link, Switch } from 'react-router-dom';
import GameMatcher from './GameMatcher';

const Games = () => {


  return (
    <BrowserRouter>
      <div>
        <Link to="/game/number-baseball?query=10&hello=react&bye=games">숫자야구</Link>
        &nbsp;
        <Link to="/game/rock-scissors-paper">가위바위보</Link>
        &nbsp;
        <Link to="/game/lotto-generator">로또</Link>
        &nbsp;
        <Link to="/game/index">게임 매쳐</Link>
      </div>
      <div>
        <Switch> {/* 스위치쓰면 첫번째로 일치하는 것만 랜더링된다. */}
          {/* <Route path="/game/:name" component={GameMatcher} /> */}
          
          {/* path="/"면 /game/..도 해당된다고 판단한다. 그래서 exact를 붙여주면 된다. */}
          <Route exact path="/" render={ (props) => <GameMatcher {...props} /> } /> 

          <Route path="/game/:name" render={ (props) => <GameMatcher {...props} /> } />
          <Route path="/game/number-baseball" render={ (props) => <GameMatcher {...props} /> } />
          <Route path="/game/number-baseball" render={ (props) => <GameMatcher {...props} /> } />
          <Route path="/game/number-baseball" render={ (props) => <GameMatcher {...props} /> } />
          <Route path="/game/number-baseball" render={ (props) => <GameMatcher {...props} /> } />
          <Route path="/game/number-baseball" render={ (props) => <GameMatcher {...props} /> } />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Games;