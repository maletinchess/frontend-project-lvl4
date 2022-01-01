// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import Component from './components/App.jsx';
import store from './slices/index.js';

import '../assets/application.scss';

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.querySelector('#chat'),
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

console.log('it works!');
