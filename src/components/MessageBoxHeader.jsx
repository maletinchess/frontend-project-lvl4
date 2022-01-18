import React from 'react';

import { useSelector } from 'react-redux';

const MessageBoxHeader = () => {
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector((state) => state.messages.messages);
  const messagesCount = messages
    .filter((m) => m.channelId === currentChannelId)
    .length;
  const channels = useSelector((state) => state.channels.channels);

  if (channels.length === 0) {
    return null;
  }
  const currentChannelData = channels.find((ch) => ch.id === currentChannelId);
  const header = `# ${currentChannelData.name}`;
  const messageCountText = `${messagesCount} messages`;
  return header && (
    <div>
      <h4><b>{header}</b></h4>
      <span>{messageCountText}</span>
    </div>
  );
};

export default MessageBoxHeader;
