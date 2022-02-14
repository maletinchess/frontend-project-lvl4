/* eslint-disable no-param-reassign */

import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { string } from 'yup';
import _ from 'lodash';
import { useImmer } from 'use-immer';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const validateUserName = (username) => {
  const schema = string()
    .trim()
    .required()
    .min(3)
    .max(20);
  try {
    schema.validateSync(username);
    return null;
  } catch (e) {
    return e.message;
  }
};

const validatePassword = (password) => {
  const schema = string()
    .trim()
    .required()
    .min(6)
    .max(20);
  try {
    schema.validateSync(password);
    return null;
  } catch (e) {
    return e.message;
  }
};

const ResponseFeedback = (props) => {
  const { errorMessage } = props;
  return (
    <div>{errorMessage}</div>
  );
};

const SignUpPage = () => {
  const [formErrors, setFormErrors] = useImmer({
    usernameError: '',
    passwordError: '',
    confirmError: '',
    serverError: '',
  });

  const navigate = useNavigate();

  const { t } = useTranslation();

  const auth = useAuth();

  const setUsernameError = (e) => {
    setFormErrors((errors) => {
      errors.usernameError = e;
    });
  };

  const setPasswordError = (e) => {
    setFormErrors((errors) => {
      errors.passwordError = e;
    });
  };

  const setConfirmPasswordError = () => {
    setFormErrors((errors) => {
      errors.confirmError = 'passwords doesn\'t match';
    });
  };

  const setServerError = () => {
    setFormErrors((errors) => {
      errors.serverError = 'user already exists';
    });
  };

  const setValidUsernameState = () => {
    setFormErrors((errors) => {
      errors.usernameError = '';
    });
  };

  const setValidPasswordState = () => {
    setFormErrors((errors) => {
      errors.passwordError = '';
    });
  };

  const setValidConfirmState = () => {
    setFormErrors((errors) => {
      errors.confirmError = '';
    });
  };

  const f = useFormik({
    initialValues: {
      body: {
        username: '',
        password: '',
        passwordConfirm: '',
      },
    },
    onSubmit: async (values) => {
      const { body } = values;
      console.log(body);

      const userErr = validateUserName(body.username);
      if (userErr) {
        console.log(userErr);
        setUsernameError(userErr);
        return;
      }

      setValidUsernameState();

      const passwordErr = validatePassword(body.password);
      if (passwordErr) {
        setPasswordError(passwordErr);
        return;
      }

      setValidPasswordState();

      if (body.password !== body.passwordConfirm) {
        setConfirmPasswordError();
        return;
      }

      setValidConfirmState();

      const bodyToSend = _.omit(body, 'passwordConfirm');
      try {
        const response = await axios.post(routes.signupPath(), bodyToSend);
        console.log(response);
        localStorage.setItem('userId', JSON.stringify(response.data));
        localStorage.setItem('username', response.data.username);
        auth.logIn();
        navigate('/');
      } catch (e) {
        console.log(e);
        setServerError();
      }
    },
  });
  return (
    <div className="container-fluid h-50">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Form className="p-3" onSubmit={f.handleSubmit}>
            <h1>{t('registration.header')}</h1>
            <Form.Group className="m-1">
              <Form.Control
                onChange={f.handleChange}
                value={f.values.login}
                placeholder={t('registration.placeholder.username')}
                name="body.username"
                id="username"
                autoComplete="username"
                isInvalid={formErrors.usernameError !== ''}
                required
              />
              <Form.Control.Feedback type="invalid">{formErrors.usernameError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Control
                type="password"
                onChange={f.handleChange}
                value={f.values.password}
                placeholder={t('registration.placeholder.password')}
                name="body.password"
                id="password"
                autoComplete="password"
                isInvalid={formErrors.passwordError !== ''}
                required
              />
              <Form.Control.Feedback type="invalid">{formErrors.passwordError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Control
                type="password"
                onChange={f.handleChange}
                value={f.values.passwordConfirm}
                placeholder={t('registration.placeholder.passwordConfirm')}
                name="body.passwordConfirm"
                id="passwordConfirm"
                autoComplete="confirm-password"
                isInvalid={formErrors.confirmError !== ''}
                required
              />
              <Form.Control.Feedback type="invalid">{formErrors.confirmError}</Form.Control.Feedback>
            </Form.Group>
            <ResponseFeedback errorMessage={formErrors.serverError} />
            <Button type="submit" variant="outline-primary" className="m-1">{t('registration.submitButton')}</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
