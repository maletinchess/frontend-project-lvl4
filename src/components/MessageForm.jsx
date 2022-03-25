import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Form, Spinner,
} from 'react-bootstrap';

import { useFormik } from 'formik';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { sendMessage } from '../socketApi.js';
import useAuth from '../hooks/index.jsx';
import { selectCurrentChannelId } from '../selectors.js';

const send = '->';

const renderSubmitButtonContent = (isSubmitting, fakeSubmitIcon) => {
  if (isSubmitting === 'loading') {
    return (
      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
    );
  }
  return (
    <>
      {fakeSubmitIcon}
    </>
  );
};

const MessageForm = (props) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const { socket } = props;

  const currentChannelId = useSelector(selectCurrentChannelId);

  const input = useRef();

  const submitHandler = async (values, { resetForm }) => {
    const username = auth.getUsername();
    const { text } = values.body;
    const filteredText = filter.clean(text);
    const newMessage = {
      text: filteredText, channelId: currentChannelId, username,
    };
    await sendMessage(newMessage, socket, t, toast);
    resetForm();
    input.current.focus();
  };

  const formik = useFormik({
    initialValues: {
      body: {
        text: '',
      },
    },
    onSubmit: submitHandler,
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form className="py-1 border-rounded-2" onSubmit={formik.handleSubmit}>
        <Form.Group className="input-group">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.body.text}
            ref={input}
            placeholder={t('messages.inputPlaceholder')}
            name="body.text"
            id="message"
            required
            className="p-0 ps-2"
            autoFocus
          />
          <Form.Label visuallyHidden htmlFor="message">{t('messages.label')}</Form.Label>
          <button
            type="submit"
            className="btn btn-group-vertical"
            disabled={(formik.isSubmitting)
            || (formik.values.body.text === '')}
          >
            {renderSubmitButtonContent(formik.isSubmitting, send)}
            <span className="visually-hidden">{t('messages.send')}</span>
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessageForm;
