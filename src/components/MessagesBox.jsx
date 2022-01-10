import React from 'react';

import { useSelector } from 'react-redux';

import { io } from 'socket.io-client';

import { Nav } from 'react-bootstrap';
import MessageBoxHeader from './MessageBoxHeader.jsx';

const MessagesBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const currentChannelId = useSelector((state) => state.chat.chat.currentChannelId);

  if (!messages) {
    return null;
  }

  return (
    <div className="mt-3">
      <MessageBoxHeader />
      <Nav variant="pils" className="flex-column">
        {messages
          .filter((item) => item.channelId === currentChannelId)
          .map((item) => (
            <Nav.Item
              fill="true"
              key={item.id}
            >
              <span className="mr-auto">{item.text}</span>
            </Nav.Item>
          ))}
      </Nav>
    </div>
  );
};

export default MessagesBox;
