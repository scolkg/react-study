import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';
import Rcp from './Rcp';

const Hot = hot( Rcp );

ReactDom.render( <Hot />, document.querySelector("#root"));
