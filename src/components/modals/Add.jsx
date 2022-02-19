import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, FormGroup, FormControl, ButtonGroup, Button,
} from 'react-bootstrap';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import { io } from 'socket.io-client';
import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Add = (props) => {
  const socket = io();
  const channelLoadingState = useSelector((state) => state.channels.loading);
  const { onHide } = props;

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const f = useFormik({
    onSubmit: (values) => {
      dispatch(setChannelLoadingState('loading'));
      const { body } = values;
      socket.emit('newChannel', { name: body }, (response) => {
        console.log(response.status);
        if (response.status !== 'ok') {
          dispatch(setChannelLoadingState('failed'));
          toast.error(t('errors.networkError'));
        } else {
          dispatch(setChannelLoadingState('finished'));
          toast.success(t('toasts.addChannel'));
        }
      });
      onHide();
    },
    initialValues: {
      body: '',
    },
  });

  return (
    <Modal.Dialog>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.add.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              data-testid="input-body"
              onChange={f.handleChange}
              value={f.values.body}
              onBlur={f.handleBlur}
              required
              name="body"
            />
          </FormGroup>
          <ButtonGroup className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.add.footer.cancel')}
            </Button>
            <input disabled={channelLoadingState === 'loading'} type="submit" className="btn btn-primary" value={t('channels.modals.add.footer.submit')} />
          </ButtonGroup>
        </form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default Add;
