import React, { useReducer, createContext, useMemo } from 'react';
import Table from './Table';

import Form from './Form';

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 다 opened
}

// 초기값을 넣어준다.
export const TableContext = createContext( {
  tableData: [],
  dispatch: () => {},
});

const initialState = {
  tableData: [],
  timer: 0,
  result: '',
}

const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);
  const candidate = Array( row * cell ).fill().map( (arr, i) => {
    return i;
  });
  console.log(candidate);
  const shuffle = [];

  console.log(Math.floor( Math.random() * candidate.length))

  while ( candidate.length > row * cell - mine ) {
    const chosen = candidate.splice(Math.floor( Math.random() * candidate.length), 1)[0];
    console.log(candidate);
  }
}

export const START_GAME = 'START_GAME';

const reducer = (state, action) => {
  switch ( action.type ) {
    case START_GAME :
      return {
        ...state,
        tableData: plantMine(action.row, action.cell, action.mine)
      }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 캐싱을 위한 useMemo사용. state.tableData가 바뀔때만 객체를 새로 생성하겠다.
  // 여기서 disaptch가 없는 건 절대로 바뀌지 않기 때문이다. dispatch는 항상 값이 유지된다.
  const value = useMemo( () => ({
    tableData: state.tabelData,
    dispatch
  }), [state.tableData]);

  return (
    <>
      {/* ContextApi는 최적화가 어렵다. 아래처럼 쓰면 랜더링될 때마다 객체가 새로 생성되는데 
      이걸 물려받은 자식 컴포넌트들도 리랜더링되기 때문에 성능에 문제가 된다. 그래서 매번 새로운
      객체가 생성되지 않게 memo를 써야한다. */}
      <TableContext.Provider value={ { tableData: state.tableData, dispatch } }>
        <Form />
        <div>{state.timer}</div>
        <Table />
        <div>{state.result}</div>
      </TableContext.Provider>
    </>
  );
};

export default MineSearch;

