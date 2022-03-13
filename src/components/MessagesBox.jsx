import React from 'react';

import { useSelector } from 'react-redux';

const MessagesBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  return (
    <div className="chat-messages overflow-auto h-100 px-5">
      {messages
        .filter((item) => item.channelId === currentChannelId)
        .map((item) => (
          <div
            className="text-break mb-2"
            key={item.id}
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
