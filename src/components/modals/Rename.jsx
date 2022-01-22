import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Modal, FormGroup, FormControl,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import { renameChannel } from '../../slices/channelSlice.js';

const Rename = (props) => {
  const socket = io();
  const { onHide, modalInfo } = props;

  const dispatch = useDispatch();

  const f = useFormik({
    initialValues: {
      body: modalInfo.item.body,
    },
    onSubmit: (values) => {
      socket.emit('renameChannel', { id: modalInfo.item.id, name: values.body }, (response) => {
        dispatch(renameChannel(response.data));
      });
      onHide();
    },
  });

  return (
    <Modal.Dialog>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Rename channel</Modal.Title>
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
          <input type="submit" className="btn btn-primary" value="submit" />
        </form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default Rename;
