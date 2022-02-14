import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: 'Hexlet chat',
      login: 'Log in',
    },
  },
  ru: {
    translation: {
      header: 'Hexlet Chat',
      login: {
        header: 'Войти',
        submitButton: 'Войти',
        placeholder: {
          username: 'Ваш ник',
          password: 'Пароль',
        },
      },
      logout: 'Выйти',
      channels: {
        channelsHeader: 'Каналы',
        addChannel: 'Переименовать',
        removeChannel: 'Удалить',
        modals: {
          add: {
            header: 'Добавить канал',
            footer: {
              submit: 'Добавить',
              cancel: 'Отменить',
            },
          },
          rename: {
            header: 'Переименовать канал',
            footer: {
              submit: 'Переименовать',
              cancel: 'Отменить',
            },
          },
          remove: {
            header: 'Удалить канал',
            footer: {
              submit: 'Удалить',
              cancel: 'Отменить',
            },
            confirm: 'Уверены?',
          },
        },
      },
      registration: {
        header: 'Регистрация',
        placeholder: {
          username: 'Имя пользователя',
          password: 'Пароль',
          passwordConfirm: 'Подтвердите пароль',
        },
        submitButton: 'Зарегистрироваться',
      },
      messages: {
        inputPlaceholder: 'Введите сообщение...',
        headerInfo: 'сообщений',
      },
      errors: {

      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    debug: true,
  });

export default i18n;
