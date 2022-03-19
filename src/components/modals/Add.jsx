import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, Button, Form,
} from 'react-bootstrap';

import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import { setChannelLoadingState } from '../../slices/channelSlice.js';

import { addChannel } from '../../socketApi.js';

const Add = (props) => {
  const channelLoadingState = useSelector((state) => state.channels.loading);
  const channels = useSelector((state) => state.channels.channels);
  const channelsNames = channels.map(({ name }) => name);
  const { onHide, socket, modalInfo } = props;

  const dispatch = useDispatch();
  const setProcessing = (result) => dispatch(setChannelLoadingState(result));

  const { t } = useTranslation();

  const input = useRef();
  useEffect(() => {
    input.current.focus();
  }, []);

  const validationSchema = Yup.object({
    body: Yup.string()
      .min(3, t('errors.notValidChannelName'))
      .max(20, t('errors.notValidChannelName'))
      .notOneOf(channelsNames, t('errors.uniqueChannelName')),
  });

  const f = useFormik({
    initialValues: {
      body: '',
    },

    onSubmit: (values) => {
      setProcessing('loading');
      const { body } = values;
      addChannel({ name: body }, socket, t, toast, setProcessing);
      onHide();
    },

    validationSchema,
    validateOnChange: false,
  });

  return (
    <Modal show={modalInfo.type === 'adding'} centered size="lg">
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.add.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              id="input-body"
              onChange={f.handleChange}
              ref={input}
              value={f.values.body}
              onBlur={f.handleBlur}
              required
              name="body"
              isInvalid={f.errors.body}
            />
            <Form.Label htmlFor="input-body" visuallyHidden>{t('channels.modals.add.body')}</Form.Label>
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.add.footer.cancel')}
            </Button>
            <Button
              disabled={channelLoadingState === 'loading'}
              type="submit"
              variant="primary"
            >
              {t('channels.modals.add.footer.submit')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
