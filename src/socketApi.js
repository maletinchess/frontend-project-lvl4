const generateCallback = (event, t, toast, setProcessing) => (response) => {
  const toastSuccess = {
    newMessage: () => {},
    newChannel: () => toast.success(t('toasts.addChannel')),
    renameChannel: () => toast.success(t('toasts.renameChannel')),
    removeChannel: () => toast.success(t('toasts.removeChannel')),
  };

  if (response.status === 'ok') {
    setProcessing('finished');
    toastSuccess[event]();
  } else {
    setProcessing('failed');
    toast.error(t('errors.network'));
  }
};

export const sendMessage = (message, socket, t, toast, setProcessing) => {
  const sendMessageCallback = generateCallback('newMessage', t, toast, setProcessing);
  socket.emit('newMessage', message, sendMessageCallback);
};

export const addChannel = (channel, socket, t, toast, setProcessing) => {
  const addChannelCallback = generateCallback('newChannel', t, toast, setProcessing);
  socket.emit('newChannel', channel, addChannelCallback);
};

const socketEmitApi = (event, data, setProcessing, socket, t, toast) => {
  const mapped = {
    newMessage: () => sendMessage(data, socket, t, toast, setProcessing),
    addChannel: () => addChannel(data, socket, t, toast, setProcessing),
  };

  return mapped[event]();
};

export default socketEmitApi;
