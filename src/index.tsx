import React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);

declare const module: any;
if (module.hot) module.hot.accept();
