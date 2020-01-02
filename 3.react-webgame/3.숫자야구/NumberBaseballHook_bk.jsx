import React , { Component } from 'react';
import { useState, useRef } from 'react';

const NumberBaseballHook = () => {
  const [word, setWord] = useState('초밥');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputEl = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();
    
  };

  const onChangeInput = (e) => {
    setValue(e.currentTarget.value);
  }

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="wordInput">글자를 입력하세요. </label>
        <input id="wordInput" className="wordInput" ref={inputEl} value={value} onChange={onChangeInput} />
        <button>입력</button>
      </form>
      <div>{result}</div>
    </>
  );
};


export default NumberBaseballHook; // import NumberBaseball; <- 가져올때 // module.exports 와 같지만 엄밀히 말하면 좀 다르다... (어느정도 호환... 깊게 들어가면 좀 다르다)

// export const NumberBaseball; // import { NumberBaseball } <- 가져올때

// 즉 Component 는 { Component } 이런식으로 가져오니까 export const Component; 이런식인 것.
