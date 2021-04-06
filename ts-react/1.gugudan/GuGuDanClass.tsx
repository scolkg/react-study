import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';

// 타입 추론이 가능하게 interface를 만들어준다.
interface IState { // I 붙여주는 건 취향이다.
  first: number,
  second: number,
  value: string,
  result: string,
}

// Component의 제너릭은 첫번째는 props에 대한 타이핑, 두번째는 State에 대한 타이핑이다.
class GuGuDan extends Component<{}, IState> {
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: '',
    result: '',
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (parseInt(this.state.value) === this.state.first * this.state.second) {
      this.setState((prevState) => {
          return {
              result: '정답: ' + prevState.value,
              first: Math.ceil(Math.random() * 9),
              second: Math.ceil(Math.random() * 9),
              value: '',
          };
      });
      // if로 감싸주면 확실하게 해주니까 에러를 잡아준다.
      if (this.input) {
          this.input.focus();
      }
  
  } else {
      this.setState({
          result: '땡',
          value: '',
      });
      if (this.input) {
          this.input.focus();
      }
  }
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  input: HTMLInputElement | null = null;

  onRefInput = (c: HTMLInputElement) => { this.input = c; };

  render() {
    return (
      <>
        <div>{this.state.first} 곱하기 {this.state.second} 는?</div>
        <form onSubmit={this.onSubmit}>
          <input 
            ref={this.onRefInput}
            type="number"
            value={this.state.value}
            onChange={this.onChange}
          />
          <button>입력!</button>
        </form>
        <div>{this.state.result}</div>
      </>
    );
  }
}

export default GuGuDan;
