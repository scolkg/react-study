import React, { useReducer, createContext, useMemo, useEffect } from 'react';
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
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',
  halted: true,
  openedCount: 0,
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
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

const reducer = (state, action) => {
  switch ( action.type ) {
    case START_GAME :
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted : false,
        timer: 0,
      }
    case OPEN_CELL : {
      const tableData = [...state.tableData]; // 불변성 지키지 위해서 배열은 이렇게 복사.
      /* tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.OPENED; */
      // 주변에 빈 칸들도 열어야 하는 작업때문에 다른 칸들도 불변성을 지켜야 한다.
      // 즉 모든 칸들을 새로운 객체로 만들어줘야 한다.
      tableData.forEach( (row, i) => {
        tableData[i] = [...state.tableData[i]];
      });

      const checked = []; // 재귀호출할 때 한번 검사한 칸은 다시 검사하지 않도록 하기 위함.
      let openedCount = 0;

      const checkAround = (row, cell) => {
        // 상하좌우 칸이 아닌 경우를 필터링
        if ( row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length ) {
          return;
        }

        // 닫힌 칸만 열기.
        if ( [CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes( tableData[row][cell] )) {
          return;
        }

        // 이미 검사한 칸이면 필터링.
        if ( checked.includes( row +',' + cell )) {
          return;
        } else {
          checked.push( row +','+ cell);
        }

        let around = [
          tableData[row][cell - 1], tableData[row][cell + 1],
        ];
        // 주변 셀 (8칸, 또는 3칸, 또는 5칸) 검사
        if (tableData[row -1]) { // 내 윗줄이 있다면
          around = around.concat(
            tableData[row - 1][cell -1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1],
          );
        }
        if (tableData[row + 1]) { // 내 아랫줄이 있다면
          around = around.concat(
            tableData[row + 1][cell -1],
            tableData[row + 1][cell],
            tableData[row + 1][cell +1],  
          );
        }
        // 주변 지뢰 있는지 찾아서 개수를 구한다.
        const count = around.filter( function (v) {
          return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
        }).length;
        // const count = around.filter( (v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;

        // 주변에 mine이 없다면 재귀로 돌면서 빈칸을 모두 찾아 오픈한다.
        if (count === 0) {
          if (row > -1) {
            const near = [];
            if (row - 1 > - 1) { // 윗칸
              near.push( [row -1, cell -1] );
              near.push( [row -1, cell] );
              near.push( [row -1, cell +1] );
            }
            near.push( [row, cell -1] );
            near.push( [row, cell +1] );
  
            if (row + 1 < tableData.length) { // 아랫칸
              near.push( [row +1, cell -1] );
              near.push( [row +1, cell] );
              near.push( [row +1, cell +1] );
            }
            near.forEach( (n) => {
              // 닫혀 있는 near를 전부 연다
              if ( tableData[ n[0] ][ n[1] ] !== CODE.OPENED ) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }
        if (tableData[row][cell] === CODE.NORMAL) { // 내 칸이 닫힌 칸일때만
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };

      // 먼저 내 기준으로 주변 지뢰를 체크
      checkAround(action.row, action.cell);

      let halted = false;
      let result = '';
      console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) { // 승리
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다`;
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted, 
        result,
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
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
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

  useEffect(() => {
    let timer;
    if (halted === false) {
      timer = setInterval(() => {
        dispatch({ type: INCREMENT_TIMER });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    }
  }, [halted]);

  return (
    <>
      {/* ContextApi는 최적화가 어렵다. 아래처럼 쓰면 랜더링될 때마다 객체가 새로 생성되는데 
      이걸 물려받은 자식 컴포넌트들도 리랜더링되기 때문에 성능에 문제가 된다. 그래서 매번 새로운
      객체가 생성되지 않게 memo를 써야한다. */}
      <TableContext.Provider value={value}>
        <Form />
        <div>{timer}</div>
        <Table />
        <div>{result}</div>
      </TableContext.Provider>
    </>
  );
};

export default MineSearch;

