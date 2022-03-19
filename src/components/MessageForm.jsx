import React, { useRef } from 'react';
import {
  Form, Spinner,
} from 'react-bootstrap';

import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { setMessageLoadingState } from '../slices/messageSlice.js';
import { sendMessage } from '../socketApi.js';

const send = '->';

const renderSubmitButtonContent = ({ messageLoadingState }, fakeSubmitIcon) => {
  if (messageLoadingState === 'loading') {
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
  const dispatch = useDispatch();
  const setProcessing = (result) => dispatch(setMessageLoadingState(result));
  const { t } = useTranslation();
  const { socket } = props;
  const { messageLoadingState } = useSelector((state) => state.messages);
  const { currentChannelId } = useSelector((state) => state.channels);

  const input = useRef();

  const submitHandler = async (values, formikBag) => {
    const { resetForm } = formikBag;
    const username = localStorage.getItem('username');
    const { text } = values.body;
    const filteredText = filter.clean(text);
    const newMessage = {
      text: filteredText, channelId: currentChannelId, username,
    };
    // try-catch errors
    await sendMessage(newMessage, socket, t, toast, setProcessing);
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

  console.log(formik.isSubmitting);
  console.log('from message form: ', messageLoadingState);

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
            isInvalid={messageLoadingState === 'failed'}
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
            {renderSubmitButtonContent({ messageLoadingState }, send)}
            <span className="visually-hidden">{t('messages.send')}</span>
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessageForm;
