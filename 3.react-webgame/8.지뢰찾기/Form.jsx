import React, { useState, useCallback, useContext }  from 'react';

import { TableContext, START_GAME } from './MineSearch';

const Form = () => {
  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(20);

  // 부모에서 export한 TableContext를 사용하겠다.
  const { dispatch } = useContext( TableContext );

  // 불필요한 렌더링을 막기위한 useCallback() 사용을 습관화하자
  const onChangeRow = useCallback((e) => {
    setRow(e.target.value);
  }, []);
  
  const onChangeCell = useCallback((e) => {
    setCell(e.target.value);
  }, []);
  
  const onChangeMine = useCallback((e) => {
    setMine(e.target.value);
  }, []);

  const onClickBtn = useCallback( () => {
    console.log('clicked start btn');
    dispatch( { type: START_GAME, row, cell, mine } );
  }, [row, cell, mine]);


  return (
    <div>
      <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
      <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
      <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
      <button onClick={onClickBtn} >시작</button>
    </div>
  );
};

export default Form;