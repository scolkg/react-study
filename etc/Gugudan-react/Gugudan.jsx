import React, { useState, useRef } from 'react';


const Gugudan = () => {

  const [firstNumber, setFirstNumber] = useState( Math.ceil( Math.random() * 9 ) );
  const [secondNumber, setSecondNumber] = useState( Math.ceil( Math.random() * 9 ) );
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const valueInput = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();
    if ( parseInt(value) === firstNumber * secondNumber ) {
      setResult( '정답: ' + value );
      setHistory( (prevHistory) => {
        return [...prevHistory, firstNumber +' 곱하기 '+ secondNumber +' 는 -> ' + value ];
      } );
      setFirstNumber( Math.ceil( Math.random() * 9 ));
      setSecondNumber( Math.ceil( Math.random() * 9 ));
      setValue('');
      valueInput.current.focus();
    } else {
      setResult('땡~');
      valueInput.current.select();
    }
  }

  const onChangeInput = (e) => {
    setValue(e.target.value);
  }

  const renderHistory = () => {
    
    return (
      history.length === 0 
      ? null
      : <ul>
          {history.map( (v, i) => {
            return <li key={`${i}번째 이력`}>{v}</li>;
          })}
        </ul>
    );
  }

  return(
    <>
      <h3>구구단</h3>
      <div>
        {firstNumber} 곱하기 {secondNumber} 는?
      </div>
      <form onSubmit={onSubmitForm}>
        <input ref={valueInput} onChange={onChangeInput} value={value}></input>
        <button id="" htmlFor="" className="">입력</button>
      </form>
      <div id="result">결과: {result}</div>
      <hr />
      {renderHistory()}
    </>
  );
}

export default Gugudan;