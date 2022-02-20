// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import Component from './components/App.jsx';
import store from './slices/index.js';

import i18n from './i18n';

import '../assets/application.scss';

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '9671e3800fa04d45be0f1b34555b98d6',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!');

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Component />
    </Provider>
  </I18nextProvider>,
  document.querySelector('#chat'),
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

console.log('it works!');
