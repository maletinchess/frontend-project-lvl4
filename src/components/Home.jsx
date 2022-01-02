import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Form, Button, Nav, ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import routes from '../routes.js';
import {
  loadState, addMessage, switchCurrentChannel, resetMessages,
} from '../slices/chatSlice.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Home = () => {
  const socket = io();
  const chat = useSelector((state) => state.chat.chat);
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
    };

    fetchContent();

    socket.on('newMessage', (newMessageFromServer) => {
      console.log(newMessageFromServer);
      dispatch(addMessage(newMessageFromServer));
    });
  }, []);

  const { channels, currentChannelId } = chat;

  const handleResetMessages = () => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.emit('reset');
  };

  const handleSwitchChannel = (id) => {
    dispatch(switchCurrentChannel(id));
    console.log(currentChannelId);
  };

  const formik = useFormik({
    initialValues: {
      body: {
        text: '',
      },
    },
    onSubmit: (values) => {
      socket.on('connect', () => {
        console.log(socket.id, '!!!!');
      });
      const { text } = values.body;
      const newMessage = {
        text, channelId: currentChannelId,
      };
      socket.emit('newMessage', newMessage, (response) => {
        console.log(response.status);
      });
    },
  });

  const Channels = () => {
    if (!channels) {
      return null;
    }

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

  const CurrentChannel = () => {
    if (!channels) {
      return null;
    }
    const currentChannelName = channels.find((ch) => ch.id === currentChannelId).name;
    return currentChannelName && <p>{currentChannelName}</p>;
  };

  const MessagesBox = () => {
    const messages = useSelector((state) => state.chat.chat.messages);
    if (!messages) {
      return null;
    }

    const messageElems = messages
      .filter((item) => item.channelId === currentChannelId)
      .map((item) => (
        <li
          className="list-group-item d-flex"
          key={item.id}
        >
          <span className="mr-auto">{item.text}</span>
        </li>
      ));

    return (
      <div className="mt-3">
        <ul className="list-group">
          {messageElems}
        </ul>
      </div>
    );
  };

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
                <CurrentChannel />
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
