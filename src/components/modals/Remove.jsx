import React from 'react';

import { useDispatch } from 'react-redux';

import {
  Modal, FormGroup,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Remove = (props) => {
  const { modalInfo, onHide } = props;
  const { id } = modalInfo.item;
  const socket = io();

  const dispatch = useDispatch();

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
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <input type="submit" className="btn btn-danger" value="remove" />
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default Remove;
