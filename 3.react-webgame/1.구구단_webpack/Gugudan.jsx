const React = require('react');
const { useState, useRef } = React;


const Gugudan = () => {
        
  const [first, setFirst] = useState( Math.ceil( Math.random() * 9 ));
  const [second, setSecond] = useState( Math.ceil( Math.random() * 9 ));
  const [value, setValue] = useState( '' );
  const [result, setResult] = useState( '' );
  const resultInput = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();
    if( parseInt(value) === first * second){
      // 역시 함수를 이용하면 이전 값도 컨트롤 가능
      setResult( (prevResult) => {
        console.log(prevResult);
        return '이전 값: ' + prevResult;
      } );

      setResult('정답: ' + value);
      setFirst( Math.ceil( Math.random() * 9 ) );
      setSecond( Math.ceil( Math.random() * 9 ) );
      setValue('');
      resultInput.current.focus();
    }else{
      setResult('땡~:' + value);
      setValue('');
      resultInput.current.focus();
    }
    
  }

  const onChangeInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div>{first} 곱하기 {second} 는?</div>
      <form onSubmit={onSubmitForm}>
        <input ref={resultInput} onChange={onChangeInput} value={value} />
        <button id="" htmlFor="" className="">입력!</button>
      </form>
      <div id="result">{result}</div>
    </>
  );
}

module.exports = Gugudan;