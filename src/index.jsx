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
import socketClient from './socketClient';

import '../assets/application.scss';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Component socket={socketClient} />
    </Provider>
  </I18nextProvider>,
  document.querySelector('#chat'),
);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

console.log('it works!');
