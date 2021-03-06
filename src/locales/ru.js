export default {
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
      renameChannel: 'Переименовать',
      removeChannel: 'Удалить',
      dropdownHeader: 'Управление каналом',
      modals: {
        add: {
          header: 'Добавить канал',
          body: 'Имя канала',
          footer: {
            submit: 'Отправить',
            cancel: 'Отменить',
          },
        },
        rename: {
          header: 'Переименовать канал',
          body: 'Имя канала',
          footer: {
            submit: 'Отправить',
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
      label: 'Новое сообщение',
      send: 'Отправить',
      messagesCount: {
        key_one: '{{count}} сообщениe',
        key_few: '{{count}} сообщения',
        key_many: '{{count}} сообщений',
      },
    },
    errors: {
      network: 'Ошибка сети',
      userExist: 'Такой пользователь уже существует',
      notValidUsernameLength: 'От 3 до 20 символов',
      shortPassword: 'Не менее 6 символов',
      notValidChannelName: 'От 3 до 20 символов',
      passwordIsNotConfirmed: 'Пароли должны совпадать',
      longPassword: '',
      unknownError: 'неизвестная ошибка',
      wrongPasswordOrUsername: 'Неверные имя пользователя или пароль',
      unauthorized: 'ошибка авторизации',
      emptyField: 'Обязательное поле',
      uniqueChannelName: 'Должно быть уникальным',
    },
    toasts: {
      addChannel: 'Канал создан',
      renameChannel: 'Канал переименован',
      removeChannel: 'Канал удалён',
    },
  },
};
