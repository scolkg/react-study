import React, { useState } from 'react';

function getLottoNumbers() {
  const candidate = Array(45).fill().map( (v, i) => {
    return i + 1;
  });
  const shuffle = [];
  while ( candidate.length > 0 ) {
    let randomNum = candidate.splice( Math.floor( Math.random() * candidate.length ), 1);
    shuffle.push( parseInt(randomNum) );
  }
  const winNumbers = shuffle.slice(0, 6).sort( (p, c) => p - c );
  
  return winNumbers;
}

function getBackground(number) {
  let style = {};
  if( number <= 10 ) {
    style.backgroundColor = 'red';
    style.color = 'white';
  } else if( number <= 20 ) {
    style.backgroundColor = 'orange';
  } else if( number <= 30 ) {
    style.backgroundColor= 'yellow';
  } else if( number <= 40 ) {
    style.backgroundColor = 'blue';
    style.color = 'white';
  } else {
    style.backgroundColor = 'green';
    style.color = 'white';
  }
  return style;
}

const Lotto = () => {

  const [numbers, setNumbers] = useState([]);
  const [history, setHistory] = useState([]);

  const onClickLotto = (e) => {
    const winNumbers = getLottoNumbers();

    setNumbers( winNumbers );
    setHistory( (prevHistory) => {
      return [...prevHistory, winNumbers];
    });
  }

  const renderHistory = () => {
    return (
      history.length === 0
      ? null
      : <>
        <hr />
          {history.map( (v, i) => {
            return (
              <div key={`${i}번째`} style={{marginBottom:'5px'}}>
                {v.map( (p, c) => {
                  return <div key={`${p}번째`} className="ball" style={getBackground(p)} >{p}</div>
                })}
              </div>
            );
          })}
      </>
    );
  }

  return (
    <>
      <h2>로또 생성기</h2>
      <div>
        <button onClick={onClickLotto}>생성</button>
      </div>
      <hr />
      <div>
        {
          numbers.map( (v, i) => {
            return <div key={`${i}번째`} className="ball" style={getBackground(v)} >{v}</div>
          })
        }
      </div>
      <h3>히스토리</h3>
      {renderHistory()}
    </>
  );
}

export default Lotto;