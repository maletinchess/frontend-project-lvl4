import React from 'react';

import { useTranslation } from 'react-i18next';
import * as selector from '../selectors.js';

const MessageBoxHeader = () => {
  const all = selector.useGetState();
  const currentChannelId = selector.currentChannelIdSelector(all);
  const messagesCount = selector.messagesCountSelector(currentChannelId)(all);
  const channels = selector.channelsSelector(all);

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
