/* eslint-disable no-param-reassign */

import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';

const SignUpForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const input = useRef();

  const errorHandler = (e, setErrors) => {
    if (e.response && e.response.status === 409) {
      setErrors({
        username: t('errors.userExist'),
      });
    } else {
      toast.error(t('errors.network'));
    }
  };

  const submitHandler = async (values, { setErrors }) => {
    const { username, password } = values;
    const body = { username, password };
    try {
      await auth.signup(axios, body);
      await navigate('/', { from: location });
    } catch (e) {
      errorHandler(e, setErrors);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .min(3, t('errors.notValidUsernameLength'))
        .max(20, t('errors.notValidUsernameLength'))
        .required(t('errors.emptyField')),
      password: Yup.string()
        .trim()
        .min(6, t('errors.shortPassword'))
        .max(20, t('errors.longPassword'))
        .required(t('errors.emptyField')),
      passwordConfirm: Yup.string()
        .trim()
        .oneOf([Yup.ref('password')], t('errors.passwordIsNotConfirmed')),
    }),

    onSubmit: submitHandler,

    validateOnChange: false,

    initialTouched: {
      username: true,
      password: true,
      passwordConfirm: true,
    },
  });

  const formikTouched = formik.touched.username
  || formik.touched.password
  || formik.touched.passwordConfirm;

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
                isInvalid={formik.errors.username && formikTouched}
                ref={input}
                autoFocus
              />
              <Form.Label htmlFor="username" visuallyHidden>{t('registration.placeholder.username')}</Form.Label>
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
                isInvalid={formik.errors.password && formikTouched}
              />
              <Form.Label htmlFor="password" visuallyHidden>{t('registration.placeholder.password')}</Form.Label>
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
                isInvalid={formik.errors.passwordConfirm && formikTouched}
              />
              <Form.Label htmlFor="passwordConfirm" visuallyHidden>{t('registration.placeholder.passwordConfirm')}</Form.Label>
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
