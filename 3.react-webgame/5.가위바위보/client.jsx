import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';
import Rsp from './RspHook';
//import Rsp from './Rsp';

const Hot = hot( Rsp );

ReactDom.render( <Hot />, document.querySelector("#root"));
