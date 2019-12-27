const React = require('react');
const ReactDom = require('react-dom');
const { hot } = require('react-hot-loader/root');


const WordRelayHook = require('./WordRelayHook');

const Hot = hot(WordRelayHook);

ReactDom.render( <Hot />, document.querySelector('#root'));