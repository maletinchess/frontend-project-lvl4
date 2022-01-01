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
  }, []);

  const { channels, currentChannelId } = chat;

  const socket = io();

  const handleTestSocket = () => {
    dispatch(resetMessages());
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
        console.log(socket.id);
      });
      const { text } = values.body;
      const newMessage = {
        text, channelId: currentChannelId,
      };
      socket.emit('newMessage', newMessage, (response) => {
        console.log(response);
      });
      socket.on('newMessage', (newMessageFromServer) => {
        console.log(newMessageFromServer);
        dispatch(addMessage(newMessageFromServer));
        socket.disconnect();
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
    if (!channels) {
      return null;
    }

    const messageSelector = useSelector((state) => state.chat.chat.messages);

    const [messagesFromServer, loadMessagesFromServer] = useState(messageSelector);

    useEffect(() => {
      loadMessagesFromServer(messageSelector);
    }, [messagesFromServer]);

    const messageElems = messagesFromServer
      .filter((item) => item.channelId === currentChannelId)
      .map((item) => (
        <li
          className="list-group-item d-flex"
          key={item.id}
        >
          <span className="mr-auto">{item.text}</span>
        </li>
      )); // change tags ui  from ex toolkit

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
                <Button onClick={handleTestSocket}>Reset</Button>
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