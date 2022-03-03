import React, { useEffect } from 'react';
import {
  Container, Row, Col, Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import routes from '../routes.js';
import MessagesBox from './MessagesBox.jsx';
import MessageBoxHeader from './MessageBoxHeader.jsx';
import MessageForm from './MessageForm.jsx';
import Channels, { ChannelsHeader } from './Channels2.jsx';

import {
  addMessage, loadMessages,
} from '../slices/messageSlice';

import {
  addChannel, removeChannel, renameChannel,
  loadChannels, loadChannelIds,
} from '../slices/channelSlice';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const mappedAction = {
  newChannel: addChannel,
  newMessage: addMessage,
  removeChannel,
  renameChannel,
};

const generateSocket = (eventType, socketApi, dispatch) => {
  socketApi.on(eventType, async (data) => {
    console.log('socket ON');
    const action = mappedAction[eventType];
    await dispatch(action(data));
  });
  socketApi.on('connect_error', () => {
    console.log('SOCKET_ERROR');
  });
};

const runSocket = (socketApi, dispatch) => {
  socketApi.on('newChannel', (channel) => {
    dispatch(mappedAction.newChannel(channel));
  });

  socketApi.on('newMessage', (message) => {
    dispatch(mappedAction.newMessage(message));
  });

  socketApi.on('removeChannel', (id) => {
    dispatch(mappedAction.removeChannel(id));
  });

  socketApi.on('renameChannel', (data) => {
    dispatch(mappedAction.renameChannel(data));
  });
};

const runSocket2 = (socketApi) => {
  socketApi.on('connect', () => {
    const { engine } = socketApi.io;
    console.log(engine.transport.name);
  });
};

const Home = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (!userId) {
      navigate('/login');
    }

    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      dispatch(loadChannelIds(data.currentChannelId));
      dispatch(loadChannels(data.channels));
      dispatch(loadMessages(data.messages));
    };

    fetchContent();

    socket.off();

    runSocket2(socket);
  }, []);

  const channelLoadingState = useSelector((state) => state.channels.loading);
  const messageLoadingState = useSelector((state) => state.messages.loading);

  const UserSpinner = () => {
    if (channelLoadingState !== 'loading' && messageLoadingState !== 'loading') {
      return null;
    }
    return (
      <Spinner animation="border" variant="primary" />
    );
  };

  return (
    <Container className="h-100 my-4 overflow-hidden shadow rounded">
      <Row className="flex-md-row h-100 bg-white">
        <Col md={4} className="bg-light border-end pt-0 px-5">
          <ChannelsHeader />
          <Channels />
        </Col>
        <Col className="p-0 h-100">
          <UserSpinner />
          <div className="d-flex flex-column h-100">
            <MessageBoxHeader />
            <MessagesBox />
            <MessageForm socket={socket} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
