import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal, ButtonGroup, Button, Form,
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
          toast.error(t('errors.networkError'));
        } else {
          dispatch(setChannelLoadingState('finished'));
          toast.success(t('toasts.renameChannel'));
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
          <ButtonGroup>
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.rename.footer.cancel')}
            </Button>
            <input type="submit" className="btn btn-primary" value={t('channels.modals.rename.footer.submit')} />
          </ButtonGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
