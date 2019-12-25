const React = require('react');
const { Component } = React;

class WordRelay extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      text: 'Hello, webpack!',
    };
  }

  render(){
    return (
      <div>
        <h1>{ this.state.text }</h1>
      </div>
    )
  }

}

module.exports = WordRelay;