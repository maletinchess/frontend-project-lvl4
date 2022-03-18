import React, { useEffect } from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import routes from '../routes.js';
import MessagesBox from './MessagesBox.jsx';
import MessageBoxHeader from './MessageBoxHeader.jsx';
import MessageForm from './MessageForm.jsx';
import Channels, { ChannelsHeader } from './Channels.jsx';

import {
  loadMessages,
} from '../slices/messageSlice';

import {
  loadChannels, loadChannelIds,
} from '../slices/channelSlice';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Home = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
        dispatch(loadChannelIds(data.currentChannelId));
        dispatch(loadChannels(data.channels));
        dispatch(loadMessages(data.messages));
      } catch (e) {
        console.log(e, '!!!!!!', location);
        navigate('*', { from: location });
      }
    };

    fetchContent();
  }, [location]);

  return (
    <Container className="h-100 my-4 overflow-hidden shadow rounded">
      <Row className="flex-md-row h-100 bg-white">
        <Col md={4} className="bg-light border-end pt-0 px-5">
          <ChannelsHeader />
          <Channels />
        </Col>
        <Col className="p-0 h-100">
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
