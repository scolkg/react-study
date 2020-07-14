import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';

import Games from './Games';
//import Games from './GamesHashRouter';

const Hot = hot( Games );

ReactDom.render( <Hot />, document.querySelector('#root'));
