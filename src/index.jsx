// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import ReactDOM from 'react-dom';
import React from 'react';

import Component from './components/App.jsx';

import '../assets/application.scss';

ReactDOM.render(
  <Component />,
  document.querySelector('#chat'),
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

console.log('it works!');
