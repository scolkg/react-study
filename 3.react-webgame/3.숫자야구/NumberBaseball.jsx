import React , { Component } from 'react';
import Try from './Try';

function getNumbers() { // 숫자 4개를 겹치지 않고 랜덤하게 뽑는 함수
  return ""
}

class NumberBaseball extends Component {
  state = {
    result: '',
    value: '',
    answer: getNumbers(),
    tries: [],
  };

  onSubmitForm = (e) => {
    e.preventDefault();
  };

  onChangeInput = (e) => {

  };

  fruits = [
    {fruit: '사과', taste: '맛있다'},
    {fruit: '귤', taste: '달다'},
    {fruit: '감', taste: '쓰다'},
  ];

  render() {
    return(
      <>
        <h1>{this.state.result}</h1>
        <form onSubmit={ this.onSubmitForm }>
          <input maxLength={4} value={this.state.value} onChange={ this.onChangeInput } />
        </form>
        <div>시도: {this.state.tries.length}</div>
        <ul>
          {/* key는 여기서 넣어주기만 하면 된다. */}
          { this.fruits.map( (v, i) =>{
            return (
              <Try key={v.fruit + v.taste} value={v} index={i} /> 
            )
          } ) }
        </ul>
      </>
    );
  }

}

export default NumberBaseball; // import NumberBaseball;