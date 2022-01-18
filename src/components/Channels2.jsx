import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Nav, DropdownButton, Dropdown, Button, ButtonGroup,
} from 'react-bootstrap';
import {
  setCurrentChannelId,
} from '../slices/channelSlice.js';

import {
  addModal, removeModal,
} from '../slices/modalSlice.js';

const renderChannel = (channel, switchChannel, currentChannelId) => {
  const UserDropButton = () => {
    if (!channel.removable) {
      return null;
    }

    const { id } = channel;

    const dispatch = useDispatch();

    const handleShowRemove = () => {
      dispatch(removeModal(id));
    };

    return (
      <DropdownButton
        id="dropdown-basic-button"
        title=""
        className="flex-grow-0"
        variant="secondary"
      >
        <Dropdown.Item>Rename</Dropdown.Item>
        <Dropdown.Item onClick={handleShowRemove}>Remove</Dropdown.Item>
      </DropdownButton>
    );
  };

  return (
    <Nav.Item key={channel.id} className="d-flex">
      <Button
        onClick={() => switchChannel(channel.id)}
        size="sm"
        active={channel.id === currentChannelId}
        variant={channel.id === currentChannelId ? 'secondary' : ''}
        className="w-100"
      >
        <span>#</span>
        <span>{channel.name}</span>
      </Button>
      <UserDropButton />
    </Nav.Item>
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  if (!channels) {
    return null;
  }

  const handleSwitchChannel = (id) => {
    dispatch(setCurrentChannelId(id));
  };

  const handleShowAddModal = () => {
    dispatch(addModal());
  };

  const AddButton = () => (
    <ButtonGroup className="d-flex mb-2 ps-4 pe-2 justify-content-between">
      <span>channels</span>
      <Button className="p-0" variant="light" onClick={handleShowAddModal}>+</Button>
    </ButtonGroup>
  );

  return (
    <Nav variant="pils" className="flex-column px-2">
      <AddButton />
      {channels.map((ch) => renderChannel(ch, handleSwitchChannel, currentChannelId))}
    </Nav>
  );
};

export default Channels;
