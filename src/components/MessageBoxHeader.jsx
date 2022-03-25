import React from 'react';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as selector from '../selectors.js';

const MessageBoxHeader = () => {
  const currentChannelId = useSelector(selector.selectCurrentChannelId);
  const messagesCount = useSelector(selector.selectCurrentMessages).length;
  const channels = useSelector(selector.selectChannels);

  const { t } = useTranslation();

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
