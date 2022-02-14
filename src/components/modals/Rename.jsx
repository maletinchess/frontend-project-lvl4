import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Modal, FormGroup, FormControl, ButtonGroup, Button,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Rename = (props) => {
  const socket = io();
  const { onHide, modalInfo } = props;

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const f = useFormik({
    initialValues: {
      body: modalInfo.item.body,
    },
    onSubmit: (values) => {
      dispatch(setChannelLoadingState('loading'));
      socket.emit('renameChannel', { id: modalInfo.item.id, name: values.body }, (response) => {
        console.log(response);
        if (response.status !== 'ok') {
          dispatch(setChannelLoadingState('failed'));
        } else {
          dispatch(setChannelLoadingState('finished'));
        }
      });
      onHide();
    },
  });

  return (
    <Modal.Dialog>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.rename.header')}</Modal.Title>
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
          <ButtonGroup>
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.rename.footer.cancel')}
            </Button>
            <input type="submit" className="btn btn-primary" value={t('channels.modals.rename.footer.submit')} />
          </ButtonGroup>
        </form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default Rename;
