import React, { useEffect } from 'react';
import {
  Container, Row, Col, Form, Button, ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import routes from '../routes.js';
import MessagesBox from './MessagesBox.jsx';
import MessageBoxHeader from './MessageBoxHeader.jsx';
import Channels, { ChannelsHeader } from './Channels2.jsx';

import {
  addMessage, loadMessages,
} from '../slices/messageSlice';

import {
  addChannel, removeChannel,
  loadChannels, loadChannelIds,
} from '../slices/channelSlice';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const socket = io();

const mappedAction = {
  newChannel: addChannel,
  newMessage: addMessage,
  removeChannel,
};

const generateSocket = (eventType, socketApi, dispatch) => {
  socketApi.on(eventType, (data) => {
    const action = mappedAction[eventType];
    dispatch(action(data));
  });
};

const Home = () => {
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

    generateSocket('newChannel', socket, dispatch);

    generateSocket('newMessage', socket, dispatch);

    generateSocket('removeChannel', socket, dispatch);

    socket.io.on('error', (error) => {
      console.log(error);
    });
  }, []);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const formik = useFormik({
    initialValues: {
      body: {
        text: '',
      },
    },
    onSubmit: (values) => {
      const username = localStorage.getItem('username');
      const { text } = values.body;
      const newMessage = {
        text, channelId: currentChannelId, username,
      };
      socket.emit('newMessage', newMessage, (response) => {
        console.log(response.data);
      });
    },
  });

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
            <div className="mt-auto px-5 py-3">
              <Form className="py-1 border-rounded-2" onSubmit={formik.handleSubmit}>
                <Form.Group>
                  <Form.Label />
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.body.text}
                    placeholder="message text"
                    name="body.text"
                    id="message"
                    required
                  />
                </Form.Group>
                <ButtonGroup>
                  <Button type="submit" variant="outline-secondary">Submit</Button>
                </ButtonGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
