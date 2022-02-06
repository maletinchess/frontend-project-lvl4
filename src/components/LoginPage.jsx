import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);

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
