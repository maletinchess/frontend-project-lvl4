import React from 'react';

import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

const MessageBoxHeader = () => {
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const all = useSelector((state) => state);
  const messagesSelector = (state) => state.messages.messages;

  const { t } = useTranslation();

  const messagesCountSelector = createSelector(
    messagesSelector,
    (messages) => messages
      .filter((message) => message.channelId === currentChannelId)
      .length,
  );

  const messagesCount = messagesCountSelector(all);

  const channels = useSelector((state) => state.channels.channels);

  if (channels.length === 0) {
    return null;
  }
  const currentChannelData = channels.find((ch) => ch.id === currentChannelId);
  const header = `# ${currentChannelData.name}`;
  const messageCountText = t('messages.messagesCount.key', { count: messagesCount });
  return header && (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <h4><b>{header}</b></h4>
      <span>{messageCountText}</span>
    </div>
  );
};

export default MessageBoxHeader;
