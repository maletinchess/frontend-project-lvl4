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
import Channels from './Channels2.jsx';

import {
  addMessage, loadMessages,
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
      dispatch(loadChannelIds(data.currentChannelId));
      dispatch(loadChannels(data.channels));
      dispatch(loadMessages(data.messages));
    };

    fetchContent();
  }, []);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
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
        dispatch(addMessage(response.data));
      });
    },
  });

  return (
    <div className="d-flex flex-column h-100">
      <Container className="h-100 my-4 overflow-hidden shadow rounded d-flex flex-column">
        <Row className="flex-md-row h-100">
          <Col md={4} className="bg-light border-end pt-0 px-5">
            <Channels />
          </Col>
          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <MessagesBox />
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
