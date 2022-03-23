import React, { useEffect, useRef } from 'react';

import * as selector from '../selectors.js';

const MessagesBox = () => {
  const all = selector.useGetState();
  const messages = selector.messagesSelector(all);
  const currentChannelId = selector.currentChannelIdSelector(all);

  const filteredMessages = messages.filter((item) => item.channelId === currentChannelId);
  const lastMessage = filteredMessages[messages.length - 1];

  const messagesEndref = useRef(lastMessage);
  const scrollToBottom = () => {
    messagesEndref.current?.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChannelId]);

  return (
    <div className="chat-messages overflow-auto px-5">
      {filteredMessages
        .map((item, index) => (
          <div
            className="text-break mb-2"
            key={item.id}
            ref={index === filteredMessages.length - 1 ? messagesEndref : null}
          >
            <span className="mr-auto">
              <b>{item.username}</b>
              {': '}
              {item.text}
            </span>
          </div>
        ))}
    </div>
  );
};

export default MessagesBox;
