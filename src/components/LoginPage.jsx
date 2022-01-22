import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const LoginPage = () => {
  const validateUserName = (username) => {
    const schema = yup
      .string()
      .trim()
      .required();

    try {
      schema.validateSync(username);
      return null;
    } catch (err) {
      return err.message;
    }
  };

  const validatePassword = (password) => {
    const schema = yup
      .string()
      .trim()
      .required();

    try {
      schema.validateSync(password);
      return null;
    } catch (err) {
      return err.message;
    }
  };

  const [authFailed, setAuthFailed] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const auth = useAuth();

  const navigate = useNavigate();

  const f = useFormik({
    initialValues: {
      body: {
        username: '',
        password: '',
      },
    },
    onSubmit: async (values) => {
      const passwordError = validatePassword(values.body.password);
      const userNameError = validateUserName(values.body.username);
      try {
        const res = await axios.post(routes.loginPath(), values.body);
        console.log(res.data); // add to localstore or state as username
        localStorage.setItem('userId', JSON.stringify(res.data));
        localStorage.setItem('username', res.data.username);
        auth.logIn();
        navigate('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        throw err;
      }
    },
  });
  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form className="p-3" onSubmit={f.handleSubmit}>
            <Form.Group>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                onChange={f.handleChange}
                value={f.values.body.username}
                placeholder="username"
                name="body.username"
                isInvalid={authFailed}
                id="username"
                autoComplete="username"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                onChange={f.handleChange}
                value={f.values.body.password}
                placeholder="password"
                name="body.password"
                isInvalid={authFailed}
                id="password"
                autoComplete="current-password"
                required
              />
              <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary">Submit</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
