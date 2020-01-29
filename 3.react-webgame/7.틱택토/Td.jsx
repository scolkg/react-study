import React, { useCallback, useRef, useEffect, memo } from 'react';
import { CLICK_CELL } from './TicTacToe';

const Td = memo(( { rowIndex, cellIndex, cellData, dispatch } ) => {
  console.log('td rendered');

  // 성능 최적화 발견
  // 바뀌는 값을 찾아야 한다.
  // 찾아서 
  const ref = useRef([]);
  useEffect( () => {
    console.log(rowIndex === ref.current[0], cellIndex === ref.current[1], dispatch === ref.current[2], cellData === ref.current[3]);
    console.log(cellData, ref.current[3]);
    ref.current = [rowIndex, cellIndex, dispatch, cellIndex];
  }, [rowIndex, cellIndex, dispatch, cellData]);

  const onClickTd = useCallback(() => {
    
    console.log(rowIndex, cellIndex, cellData);

    if( cellData ) {
      console.log("cellData is exist");
      return;
    }

    // 동기적인 리덕스와 달리 useReducer (dispatch)는 비동기로 처리하는 걸 주의해야 한다.
    // 그래서 useEffect()로 처리해야 한다.
    dispatch({
      type: CLICK_CELL,
      row: rowIndex,
      cell: cellIndex,
     });

  }, [cellData]); // 그래서 이렇게 배열 인자에 cellData를 넣어줘야 cellData 값이 바뀌면 기억을 다시 한다.
  // 바뀌는 데이터를 감지를 못하기때문에 이렇게 배열에 cellData를 넣어줘야 함수를 기억할 수 있다.
  // 바뀔 여지가 있는 스테이트가 있다면 넣어주면 된다고 생각하면 된다.

  return (
    <td onClick={ onClickTd }>{cellData}</td>
  )
});

export default Td;