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
  halted: false,
});

const initialState = {
  tableData: [],
  timer: 0,
  result: '',
  halted: false,
}

const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);
  const candidate = Array( row * cell ).fill().map( (arr, i) => {
    return i;
  });

  const shuffle = [];
  while ( candidate.length > row * cell - mine ) {
    const chosen = candidate.splice(Math.floor( Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }

  const data = [];
  for( let i = 0 ; i < row; i++ ) {
    const rowData = [];
    data.push(rowData);
    for( let j = 0 ; j < cell ; j++ ) {
      rowData.push(CODE.NORMAL);
    }
  }

  for ( let k = 0 ; k < shuffle.length; k++ ) {
    const ver = Math.floor( shuffle[k] / cell );
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }
  
  console.log(data);
  return data;
}

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';

const reducer = (state, action) => {
  switch ( action.type ) {
    case START_GAME :
      return {
        ...state,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted : false,
      }
    case OPEN_CELL : {
      const tableData = [...state.tableData]; // 불변성 지키지 위해서 배열은 이렇게 복사.
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.OPENED;
      
      let around = [];

      // 주변 셀 (8칸, 또는 3칸, 또는 5칸) 검사
      if (tableData[action.row -1]) { // 내 윗줄이 있다면
        around = around.concat(
          tableData[action.row - 1][action.cell -1],
          tableData[action.row - 1][action.cell],
          tableData[action.row - 1][action.cell + 1],
        );
      }
      around = around.concat( // 자신의 줄
        tableData[action.row][action.cell -1],
        tableData[action.row][action.cell +1],
      );
      if (tableData[action.row + 1]) { // 내 아랫줄이 있다면
        around = around.concat(
          tableData[action.row + 1][action.cell -1],
          tableData[action.row + 1][action.cell],
          tableData[action.row + 1][action.cell +1],  
        );
      }
      // 주변 지뢰 있는지 찾아서 개수를 구한다.
      const count = around.filter( (v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;

      console.log(around, count);
      tableData[action.row][action.cell] = count;

      return {
        ...state,
        tableData,
      }
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData]; 
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true, // 게임 멈춤
      }
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData
      }
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      }
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      console.log(tableData);
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      }
    }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  // 캐싱을 위한 useMemo사용. state.tableData, halted가 바뀔때만 객체를 새로 생성하겠다.
  // 여기서 disaptch가 없는 건 절대로 바뀌지 않기 때문이다. dispatch는 항상 값이 유지된다.
  const value = useMemo( () => ({
    tableData,
    dispatch,
    halted,
  }), [tableData, halted]);

  return (
    <>
      {/* ContextApi는 최적화가 어렵다. 아래처럼 쓰면 랜더링될 때마다 객체가 새로 생성되는데 
      이걸 물려받은 자식 컴포넌트들도 리랜더링되기 때문에 성능에 문제가 된다. 그래서 매번 새로운
      객체가 생성되지 않게 memo를 써야한다. */}
      <TableContext.Provider value={value}>
        <Form />
        <div>{state.timer}</div>
        <Table />
        <div>{state.result}</div>
      </TableContext.Provider>
    </>
  );
};

export default MineSearch;

