import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import {
  Modal, Button, Form, Spinner,
} from 'react-bootstrap';

import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import { addChannel } from '../../socketApi.js';

import * as selector from '../../selectors.js';

const renderSubmitButtonContent = (isSubmitting, t) => {
  const text = t('channels.modals.add.footer.submit');
  if (isSubmitting) {
    return (
      <>
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        <span>{text}</span>
      </>
    );
  }
  return (
    <>
      {text}
    </>
  );
};

const Add = ({ onHide, socket, modalInfo }) => {
  const channels = useSelector(selector.channelsSelector);
  const channelsNames = channels.map(({ name }) => name);

  const { t } = useTranslation();

  const input = useRef();
  useEffect(() => {
    input.current.focus();
  }, []);

  const validationSchema = Yup.object({
    body: Yup.string()
      .min(3, t('errors.notValidChannelName'))
      .max(20, t('errors.notValidChannelName'))
      .notOneOf(channelsNames, t('errors.uniqueChannelName')),
  });

  const f = useFormik({
    initialValues: {
      body: '',
    },

    onSubmit: async (values) => {
      const { body } = values;
      addChannel({ name: body }, socket, t, toast);
      onHide();
    },

    validationSchema,
    validateOnChange: false,
  });

  return (
    <Modal show={modalInfo.type === 'adding'} centered size="lg">
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.modals.add.header')}</Modal.Title>
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
            <Form.Label htmlFor="input-body" visuallyHidden>{t('channels.modals.add.body')}</Form.Label>
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={onHide}>
              {t('channels.modals.add.footer.cancel')}
            </Button>
            <Button
              disabled={f.isSubmitting}
              type="submit"
              variant="primary"
            >
              {renderSubmitButtonContent(f.isSubmitting, t)}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
