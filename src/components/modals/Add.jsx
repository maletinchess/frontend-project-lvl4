import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Modal, FormGroup, FormControl,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import { addChannel } from '../../slices/channelSlice.js';

const Add = (props) => {
  const socket = io();
  const { onHide } = props;

  const dispatch = useDispatch();

  const f = useFormik({
    onSubmit: (values) => {
      const { body } = values;
      socket.emit('newChannel', { name: body }, (response) => {
        console.log(response.data);
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
        <Modal.Title>Add channel</Modal.Title>
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

export default Add;
