import React , { Component }from 'react';

export const hello = 'hello'; // import { hello }
export const bye = 'hello'; // import { hello, bye }

export default NumberBaseball; // import NumberBaseball;



class NumberBaseball extends Component {

}


const React = require('react');
const { useState, useRef } = require('react');

const NumberBaseball = () => {
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


module.exports = NumberBaseball;
