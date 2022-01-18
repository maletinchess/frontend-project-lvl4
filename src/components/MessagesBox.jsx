import React from 'react';

import { useSelector } from 'react-redux';

import { Nav } from 'react-bootstrap';
import MessageBoxHeader from './MessageBoxHeader.jsx';

const MessagesBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  return (
    <div className="mt-3">
      <MessageBoxHeader />
      <Nav variant="pils" className="flex-column" data-bs-spy="scroll">
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
