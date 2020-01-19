import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';

const TicTacToeHooks = () => {

  const [test, setTest] = useState('틱택토');



  return (
    <>
      <div>Hello {test}</div>
    </>
  );
}

export default TicTacToeHooks;