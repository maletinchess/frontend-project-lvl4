import React from 'react';

import { useDispatch } from 'react-redux';

import {
  Modal, FormGroup, ButtonGroup, Button,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Remove = (props) => {
  const { modalInfo, onHide } = props;
  const { id } = modalInfo.item;
  const socket = io();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(setChannelLoadingState('loading'));
    socket.emit('removeChannel', { id }, (response) => {
      if (response.status !== 'ok') {
        dispatch(setChannelLoadingState('failed'));
      } else {
        dispatch(setChannelLoadingState('finished'));
      }
    });
    onHide();
  };

  return (
    <Modal.Dialog>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.remove.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <p>{t('channels.modals.remove.confirm')}</p>
          </FormGroup>
          <ButtonGroup className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.add.footer.cancel')}
            </Button>
            <input type="submit" className="btn btn-danger" value={t('channels.modals.remove.footer.submit')} />
          </ButtonGroup>
        </form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default Remove;
