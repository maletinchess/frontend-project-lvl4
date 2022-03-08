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
        network: 'Ошибка сети',
        userExist: 'Такой пользователь уже существует',
        notValidUsernameLength: 'От 3 до 20 символов',
        shortPassword: 'Не менее 6 символов',
        longPassword: 'Not more than 20 symbols',
        passwordIsNotConfirmed: 'Пароли должны совпадать',
        unknownError: 'неизвестная ошибка',
        wrongPasswordOrUsername: 'Неверные имя пользователя или пароль',
        emptyField: 'Обязательное поле',
      },
      toasts: {
        addChannel: 'Канал создан',
        renameChannel: 'Канал переименован',
        removeChannel: 'Канал удалён',
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
