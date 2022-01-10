import React from 'react';

import { useSelector } from 'react-redux';

const MessageBoxHeader = () => {
  const currentChannelId = useSelector((state) => state.chat.chat.currentChannelId);
  const channels = useSelector((state) => state.channels.channels);

  if (channels.length === 0) {
    return null;
  }
  const current = channels.find((ch) => ch.id === currentChannelId);
  return current.name && <p>{current.name}</p>;
};

export default MessageBoxHeader;
