// @ts-check
// @ts-check
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import { io } from 'socket.io-client';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resources from './locales/index.js';

import Component from './components/App.jsx';
import store from './slices/index.js';

import '../assets/application.scss';

export default async (socketApi = io()) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const instance = i18n.createInstance();

  await instance
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
      debug: true,
    });

  ReactDOM.render(
    <Provider store={store}>
      <I18nextProvider i18n={instance}>
        <Component socket={socketApi} />
      </I18nextProvider>
    </Provider>,
    document.querySelector('#chat'),
  );
  console.log('it works!');
};
