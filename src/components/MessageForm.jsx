import React, { useEffect, useRef } from 'react';
import {
  Form, Button, ButtonGroup,
} from 'react-bootstrap';

import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { setMessageLoadingState } from '../slices/messageSlice.js';

const send = '->';

const MessageForm = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { socket } = props;
  const messageLoadingState = useSelector((state) => state.messages.loading);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const input = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: {
        text: '',
      },
    },
    onSubmit: (values, { resetForm }) => {
      dispatch(setMessageLoadingState('loading'));
      const username = localStorage.getItem('username');
      const { text } = values.body;
      const filteredText = filter.clean(text);
      console.log('check filter: ', text, filteredText);
      const newMessage = {
        text: filteredText, channelId: currentChannelId, username,
      };
      socket.emit('newMessage', newMessage, (response) => {
        if (response.status !== 'ok') {
          dispatch(setMessageLoadingState('failed'));
        } else {
          dispatch(setMessageLoadingState('finished'));
          resetForm();
        }
      });
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form className="py-1 border-rounded-2" onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label />
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.body.text}
            ref={input}
            placeholder={t('messages.inputPlaceholder')}
            name="body.text"
            id="message"
            required
            isInvalid={messageLoadingState === 'failed'}
          />
          <Form.Control.Feedback type="invalid">Message sending failed</Form.Control.Feedback>
        </Form.Group>
        <ButtonGroup>
          <Button
            type="submit"
            variant="outline-secondary"
            disabled={messageLoadingState === 'loading'}
          >
            {send}
          </Button>
        </ButtonGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
