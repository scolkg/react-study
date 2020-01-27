import React, { useState, useReducer, useRef, useMemo, useEffect, useCallback } from 'react';
import Table from './Table';

const initialState = {
  winner: '',
  turn: 'O',
  tableData: [
    ['', '', ''], 
    ['', '', ''], 
    ['', '', '']
  ],
}

// ( 스테이트를 바꾸는 )액션의 이름은 대문자로 상수로 정하는게 일반적인 규칙이다. (꼭 그럴필욘 없지만...)
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';

const reducer = (state, action) => {
  // reducer 함수안에서 state들을 어떻게 바꿀지 정해주는 것!
  switch (action.type) {
    case 'SET_WINNER' :
      // state.winner = action.winner; <- 이렇게 하면 안됨. 객체를 새로 만들어줘야 함!

      return {
        ...state, // 기존 스테이트를 바꾸는게 아니라 새로운 스테이트를 만들어주는 역할. (얕은 복사 (불변성을 위함))
        winner: action.winner,
      }
    case CLICK_CELL : {
      // 먼저 기존의 tableData를 얕은 복사해준다. (객체는 불변성때문에 얕은복사해줘야 한다!..리액트의 단점..)
      // immer라는 라이브러리로 이 단점(가독성)을 해결할 수 있다.
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]];
      tableData[action.row][action.cell] = state.turn;

      return {
        ...state,
        tableData,
      }
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === 'O' ? 'X' : 'O',
      };
    }

  }
}

const TicTacToe = () => {
  
//  useReducer 없이 만든다면 아래처럼 해야한다.
//  const [winner, setWinner] = useState('');
//  const [turn, SetTurn] = useState('O');
//  const [tableData, setTableData] = useState(['', '', ''], ['', '', ''], ['', '', '']);

  // 부모에서 자식까지의 관계가 깊어지고 전달해야 할 스테이트들이 많아지면 이렇게 useReducer를 이용하여
  // 한번에 보내줄 수 있다.
  const [state, dispatch] = useReducer(reducer, initialState);

  /* useCallback을 필수로 적용해야 할 때
  - Ball같은 자식 컴포넌트에 props로 함수를 넘길 때는 꼭 useCallback을 써야한다.
  useCallback이 없으면 매번 새로운 함수가 생성되는데 자식컴포넌트는 매번 함수가 생성되니까
  바뀐지 알고 쓸데없이 리랜더링되는 문제가 있다. 그래서 써야 함. */
  const onClickTable = useCallback( () => {
    // dispatch안에는 액션 객체가 들어 간다. 이 액션을 dispatch해야하고 
    // state를 어떻게 바꿀지는  reducer에서 처리해줘야 한다.
    dispatch( {type: 'SET_WINNER', winner: '0' } ); // 이렇게 액션객체만 넣어선 스테이트를 바꿔주진 않고 reducer에서 처리해줘야 한다.
  }, []);

  return (
    <>
      <Table tableData={state.tableData} dispatch={dispatch} />
      {state.winner && <div>{state.winner}님의 승리!</div>}
    </>
  );
}

export default TicTacToe;