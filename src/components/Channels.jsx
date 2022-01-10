import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Nav,
} from 'react-bootstrap';

import {
  switchCurrentChannel,
} from '../slices/chatSlice.js';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelId = useSelector((state) => state.chat.chat.currentChannelId);

  if (!channels) {
    return null;
  }

  const handleSwitchChannel = (id) => {
    dispatch(switchCurrentChannel(id));
  };

  return (
    <Nav variant="pils" className="flex-column">
      {channels.map((ch) => (
        <Nav.Item key={ch.id} className="w-100">
          <Button
            variant={ch.id === currentChannelId ? 'secondary' : ''}
            size="sm"
            active={ch.id === currentChannelId}
            onClick={() => handleSwitchChannel(ch.id)}
          >
            <span className="m-1">#</span>
            {ch.name}
          </Button>
        </Nav.Item> // change classes
      ))}
    </Nav>
  );
};

export default Channels;
