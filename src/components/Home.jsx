import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Container, Row, Col, Form, Button, Nav, ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import routes from '../routes.js';
import MessagesBox from './MessagesBox.jsx';
import Channels from './Channels.jsx';
import {
  loadState,
} from '../slices/chatSlice.js';

import {
  addMessage, loadMessages,
} from '../slices/messageSlice';

import {
  loadChannels,
} from '../slices/channelSlice';
import authContext from '../contexts/index.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const socket = io();

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
      dispatch(loadState(data));
      dispatch(loadChannels(data.channels));
      dispatch(loadMessages(data.messages));
    };

    const receiveNewMessageSocket = () => {
      socket.on('newMessage', (newMessageFromServer, acknowledge = _.noop) => {
        dispatch(addMessage(newMessageFromServer));
        acknowledge({ status: 'ok!' });
      });
    };

    receiveNewMessageSocket();

    fetchContent();

    console.log(socket.listeners('newMessage'));
  }, []);

  const handleResetMessages = () => {
    socket.emit('reset');
  };

  const currentChannelId = useSelector((state) => state.chat.chat.currentChannelId);

  const formik = useFormik({
    initialValues: {
      body: {
        text: '',
      },
    },
    onSubmit: (values) => {
      const { text } = values.body;
      const newMessage = {
        text, channelId: currentChannelId,
      };
      socket.emit('newMessage', newMessage, (response) => {
        console.log(response.status);
      });
    },
  });

  return (
    <div className="d-flex flex-column h-100">
      <Container className="h-100 my-4 overflow-hidden shadow rounded d-flex flex-column">
        <Row className="flex-md-row h-100">
          <Col md={4} className="bg-light border-end">
            <p>channels</p>
            <Channels />
          </Col>
          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <MessagesBox />
                <Button onClick={handleResetMessages}>Reset all msg</Button>
              </div>
              <div className="mt-auto px-5 py-3 flex">
                <Form className="py-1 border-0 rounded-2 flex" onSubmit={formik.handleSubmit}>
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
    </div>
  );
};

export default Home;
