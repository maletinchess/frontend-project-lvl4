import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentMessages, selectCurrentChannelId } from '../selectors.js';

const MessagesBox = () => {
  const currentMessages = useSelector(selectCurrentMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);

  const lastMessage = currentMessages[currentMessages.length - 1];

  const messagesEndref = useRef(lastMessage);
  const scrollToBottom = () => {
    messagesEndref.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, currentChannelId]);

  return (
    <div className="chat-messages overflow-auto px-5">
      {currentMessages
        .map((item, index) => (
          <div
            className="text-break mb-2"
            key={item.id}
            ref={index === currentMessages.length - 1 ? messagesEndref : null}
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
