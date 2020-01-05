import React, { PureComponent } from 'react';

class Test extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      counter: 0,
      array: [],
      object: {},
    }
  }

  // 리액트에서 기본제공해주는 함수로 스테이트가 변할 때만 렌더링되도록 할 수 있다.
  // 더 간단한 방법은 Component 대신 PureComponent를 쓰면 shouldComponentUpdate()를 구현한 걸 간단하게 쓸 수 있다.
  // PureComponent의 단점은 참조 관계가 있는 객체, 배열같은 것들은 바뀌었는지 PureComponent가 구별하기 어려워한다. ㅜ
  /*
  shouldComponentUpdate( nextProps, nextState, nextContext ){
    if( this.state.counter !== nextState.counter ) {
      return true;
    }
    return false;
  };
  */

  onClick = () => {
    const tmpArray = this.state.array;
    tmpArray.push(1);

    // 이렇게 참조를 하는 배열을 새로운 배열로 바꿨는데도 PureComponent는 바뀐 건지 모른다.
    // 그래서 push() 쓰지말고 불변성을 꼭 지키는 코딩을 해야 한다. 아래처럼.
    this.setState( {
      array: tmpArray, //이렇게 쓰면 안됨!
    } );

    // 이것처럼
    this.setState({
      array: [...this.state.array, 1], // 이렇게 써야 함!
    });
  };

  onClickPlus = () => {
    this.setState( {
      counter: this.state.counter + 1,
    } );
  }

  render() {
    console.log( '렌더링', this.state );
    return (
      <div>
        <button onClick={ this.onClick} >클릭</button>
        <button onClick={ this.onClickPlus} >클릭</button>
      </div>
    );
  };
}

export default Test;