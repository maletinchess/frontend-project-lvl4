import React from 'react';

import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';

import {
  Modal, FormGroup, Button,
} from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

import * as socketEmitApi from '../../socketApi.js';

import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Remove = ({ modalInfo, onHide, socket }) => {
  const { id } = modalInfo.item;

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(setChannelLoadingState('loading'));
    socketEmitApi.removeChannel(id, socket, t, toast);
    onHide();
  };

  return (
    <Modal show={modalInfo.type === 'removing'}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.remove.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <p>{t('channels.modals.remove.confirm')}</p>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.add.footer.cancel')}
            </Button>
            <input type="submit" className="btn btn-danger" value={t('channels.modals.remove.footer.submit')} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
