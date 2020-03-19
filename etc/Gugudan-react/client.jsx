import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';

import Gugudan from './Gugudan';

const Hot = hot( Gugudan );

ReactDom.render( <Hot />, document.querySelector('#root'));