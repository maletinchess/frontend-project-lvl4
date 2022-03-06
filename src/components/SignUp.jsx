/* eslint-disable no-param-reassign */

import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const SignUpForm = () => {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .min(3, 'Must be at least 3 symbols')
        .required('required field'),
      password: Yup.string()
        .trim()
        .min(6, 'Must be at least 6 symbols')
        .max(20, 'Max-length is 20')
        .required('required field'),
      passwordConfirm: Yup.string()
        .trim()
        .required('')
        .oneOf([Yup.ref('password')], 'should match'),
    }),
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="container-fluid h-50">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Form className="p-3" onSubmit={formik.handleSubmit}>
            <h1>{t('registration.header')}</h1>
            <Form.Group className="m-1">
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.username}
                placeholder={t('registration.placeholder.username')}
                name="username"
                id="username"
                autoComplete="username"
                required
                isInvalid={formik.errors.username && formik.touched.username}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder={t('registration.placeholder.password')}
                name="password"
                id="password"
                autoComplete="password"
                required
                isInvalid={formik.errors.password && formik.touched.password}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                value={formik.values.passwordConfirm}
                placeholder={t('registration.placeholder.passwordConfirm')}
                name="passwordConfirm"
                id="passwordConfirm"
                autoComplete="confirm-password"
                isInvalid={formik.errors.passwordConfirm && formik.touched.passwordConfirm}
                required
              />
              <Form.Control.Feedback type="invalid">{formik.errors.passwordConfirm}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary" className="m-1">{t('registration.submitButton')}</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
