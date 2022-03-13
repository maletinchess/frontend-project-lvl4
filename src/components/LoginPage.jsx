import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);

  const { t } = useTranslation();

  const auth = useAuth();

  const navigate = useNavigate();

  const input = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      body: {
        username: '',
        password: '',
      },
    },
    onSubmit: async (values, { setErrors }) => {
      try {
        const res = await axios.post(routes.loginPath(), values.body);
        localStorage.setItem('userId', JSON.stringify(res.data));
        localStorage.setItem('username', res.data.username);
        auth.logIn();
        navigate('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          toast.error(t('errors.unauthorized'));
          input.current.select();
          setErrors({
            password: t('errors.wrongPasswordOrUsername'),
          });
        } else {
          toast.error(t('errors.network'));
        }
      }
    },
  });
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-50">
        <div className="col-12 col-md-8 col-xxl-6">
          <h1 className="text-center">{t('login.header')}</h1>
          <Form className="p-3" onSubmit={f.handleSubmit}>
            <Form.Group className="m-1">
              <Form.Control
                onChange={f.handleChange}
                value={f.values.body.username}
                placeholder={t('login.placeholder.username')}
                name="body.username"
                isInvalid={authFailed}
                id="username"
                autoComplete="username"
                ref={input}
                required
              />
              <Form.Label htmlFor="username" visuallyHidden>{t('login.placeholder.username')}</Form.Label>
            </Form.Group>
            <Form.Group className="m-1">
              <Form.Control
                type="password"
                onChange={f.handleChange}
                value={f.values.body.password}
                placeholder={t('login.placeholder.password')}
                name="body.password"
                isInvalid={authFailed}
                id="password"
                autoComplete="current-password"
                required
              />
              <Form.Label htmlFor="password" visuallyHidden>{t('login.placeholder.password')}</Form.Label>
              <Form.Control.Feedback type="invalid">{f.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary" className="m-1">{t('login.submitButton')}</Button>
          </Form>
          <Link to="/signup" className="p-2">{t('registration.header')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
