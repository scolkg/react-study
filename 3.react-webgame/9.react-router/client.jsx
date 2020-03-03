import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';

import Mine from './MineSearch';

const Hot = hot( Mine );

ReactDom.render( <Hot />, document.querySelector('#root'));