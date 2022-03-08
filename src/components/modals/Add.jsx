import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, ButtonGroup, Button, Form,
} from 'react-bootstrap';

import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Add = (props) => {
  const channelLoadingState = useSelector((state) => state.channels.loading);
  const channels = useSelector((state) => state.channels.channels);
  const channelsNames = channels.map(({ name }) => name);
  const { onHide, socket, modalInfo } = props;

  const dispatch = useDispatch();

  const { t } = useTranslation();

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
      dispatch(setChannelLoadingState('loading'));
      const { body } = values;
      const existedChannel = channelsNames.find((ch) => ch === body);
      console.log(body, channelsNames, existedChannel);

      try {
        socket.emit('newChannel', { name: body }, (response) => {
          if (response.status !== 'ok') {
            dispatch(setChannelLoadingState('failed'));
            toast.error(t('errors.networkError'));
          } else {
            dispatch(setChannelLoadingState('finished'));
            toast.success(t('toasts.addChannel'));
          }
        });
      } catch (e) {
        console.log(e);
        toast.error((t('errors.networkError')));
      }

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
              data-testid="input-body"
              onChange={f.handleChange}
              value={f.values.body}
              onBlur={f.handleBlur}
              required
              name="body"
              isInvalid={f.errors.body}
            />
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <ButtonGroup className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.add.footer.cancel')}
            </Button>
            <input disabled={channelLoadingState === 'loading'} type="submit" className="btn btn-primary" value={t('channels.modals.add.footer.submit')} />
          </ButtonGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
