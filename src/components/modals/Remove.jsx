import React from 'react';

import { useDispatch } from 'react-redux';

import {
  Modal, FormGroup,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import { removeChannel } from '../../slices/channelSlice.js';

const Remove = (props) => {
  const { modalInfo, onHide } = props;
  const { id } = modalInfo.item;
  const socket = io();

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    socket.emit('removeChannel', { id }, (response) => {
      dispatch(removeChannel(response.data.id));
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
