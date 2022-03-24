import {
  newMessage as newMessageAction,
} from './slices/messageSlice.js';

import {
  newChannel as newChannelAction,
  removeChannel as removeChannelAction,
  renameChannel as renameChannelAction,
} from './slices/channelSlice.js';

const generateCallback = (event, t, toast) => (response) => {
  const toastSuccess = {
    newMessage: () => {},
    newChannel: () => toast.success(t('toasts.addChannel')),
    renameChannel: () => toast.success(t('toasts.renameChannel')),
    removeChannel: () => toast.success(t('toasts.removeChannel')),
  };

  if (response.status === 'ok') {
    toastSuccess[event]();
  } else {
    toast.error(t('errors.network'));
  }
};

export const sendMessage = (message, socket, t, toast) => {
  const sendMessageCallback = generateCallback('newMessage', t, toast);
  socket.emit('newMessage', message, sendMessageCallback);
};

export const addChannel = (channel, socket, t, toast) => {
  const addChannelCallback = generateCallback('newChannel', t, toast);
  socket.emit('newChannel', channel, addChannelCallback);
};

export const removeChannel = (id, socket, t, toast) => {
  const removeChannelCallback = generateCallback('removeChannel', t, toast);
  socket.emit('removeChannel', { id }, removeChannelCallback);
};

export const renameChannel = (data, socket, t, toast) => {
  const renameChannelCallback = generateCallback('renameChannel', t, toast);
  socket.emit('renameChannel', data, renameChannelCallback);
};

export const socketOnApi = (socket, dispatch) => {
  const mappedAction = {
    newMessage: newMessageAction,
    newChannel: newChannelAction,
    removeChannel: removeChannelAction,
    renameChannel: renameChannelAction,
  };

  socket.on('newMessage', (message) => {
    dispatch(mappedAction.newMessage(message));
  });

  socket.on('newChannel', (channel) => {
    dispatch(mappedAction.newChannel(channel));
  });

  socket.on('removeChannel', (id) => {
    dispatch(mappedAction.removeChannel(id));
  });

  socket.on('renameChannel', (data) => {
    dispatch(mappedAction.renameChannel(data));
  });
};
