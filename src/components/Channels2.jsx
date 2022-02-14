import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import {
  Nav, Dropdown, Button, ButtonGroup,
} from 'react-bootstrap';
import {
  setCurrentChannelId,
} from '../slices/channelSlice.js';

import {
  addModal, removeModal, renameModal,
} from '../slices/modalSlice.js';

const renderChannel = (channel, switchChannel, currentChannelId, t) => {
  const NotRemovableChannel = () => (
    <Nav.Item as="li" className="w-100">
      <Button
        onClick={() => switchChannel(channel.id)}
        active={channel.id === currentChannelId}
        variant={channel.id === currentChannelId ? 'secondary' : ''}
        className="w-100 rounded-0 text-start"
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
    </Nav.Item>
  );

  const SplitDropDown = () => {
    const { id } = channel;

    const dispatch = useDispatch();

    const handleShowRemove = () => {
      dispatch(removeModal(id));
    };

    const handleShowRename = () => {
      dispatch(renameModal({ id, body: channel.name }));
    };

    return (
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button
          onClick={() => switchChannel(channel.id)}
          active={channel.id === currentChannelId}
          variant={channel.id === currentChannelId ? 'secondary' : ''}
          className="w-100 rounded-0 text-start text-truncate"
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>

        <Dropdown.Toggle
          split
          variant={channel.id === currentChannelId ? 'secondary' : ''}
          className="flex-grow-0"
          id="dropdown-split-basic"
        />

        <Dropdown.Menu>
          <Dropdown.Item href="#" onClick={handleShowRename}>{t('channels.addChannel')}</Dropdown.Item>
          <Dropdown.Item href="#" onClick={handleShowRemove}>{t('channels.removeChannel')}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const RemovableChannel = () => (
    <Nav.Item as="li" className="w-100">
      <SplitDropDown />
    </Nav.Item>
  );

  return channel.removable
    ? <RemovableChannel key={channel.id} />
    : <NotRemovableChannel key={channel.id} />;
};

export const ChannelsHeader = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleShowAddModal = () => {
    dispatch(addModal());
  };

  return (
    <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
      <span>{t('channels.channelsHeader')}</span>
      <Button className="p-0 text-primary btn-group-vertical" variant="light" onClick={handleShowAddModal}>+</Button>
    </div>
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channels.channels);
  console.log(channels);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  if (!channels) {
    return null;
  }

  const handleSwitchChannel = (id) => {
    dispatch(setCurrentChannelId(id));
  };

  return (
    <Nav as="ul" variant="pils" className="flex-column px-2 nav-fill">
      {channels.map((ch) => renderChannel(ch, handleSwitchChannel, currentChannelId, t))}
    </Nav>
  );
};

export default Channels;
