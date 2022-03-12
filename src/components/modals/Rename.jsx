import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, Button, Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { setChannelLoadingState } from '../../slices/channelSlice.js';

const Rename = (props) => {
  const { onHide, modalInfo, socket } = props;
  const channels = useSelector((state) => state.channels.channels);
  const channelsNames = channels.map(({ name }) => name);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const validationSchema = Yup.object({
    body: Yup.string()
      .min(3, t('errors.notValidChannelName'))
      .max(20, t('errors.notValidChannelName'))
      .notOneOf(channelsNames, t('errors.uniqueChannelName')),
  });

  const input = useRef();

  useEffect(() => {
    input.current.select();
  }, []);

  const f = useFormik({
    initialValues: {
      body: modalInfo.item.body,
    },
    onSubmit: (values) => {
      dispatch(setChannelLoadingState('loading'));
      socket.emit('renameChannel', { id: modalInfo.item.id, name: values.body }, (response) => {
        console.log(response);
        if (response.status === 'ok') {
          dispatch(setChannelLoadingState('finished'));
          toast.success(t('toasts.renameChannel'));
        } else {
          dispatch(setChannelLoadingState('failed'));
          toast.error(t('errors.networkError'));
        }
      });
      onHide();
    },

    validationSchema,
    validateOnChange: false,
  });

  return (
    <Modal show={modalInfo.type === 'renaming'}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.rename.header')}</Modal.Title>
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
            <Form.Label htmlFor="input-body" visuallyHidden>{t('channels.modals.rename.body')}</Form.Label>
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.rename.footer.cancel')}
            </Button>
            <input type="submit" className="btn btn-primary" value={t('channels.modals.rename.footer.submit')} />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
