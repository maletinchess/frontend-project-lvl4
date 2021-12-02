import React from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import routes from '../routes.js';

const LoginPage = () => {
  const validateUserName = (username) => {

  };

  const validatePassword = (password) => {

  };
  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
  });
  return (

    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form className="p-3">
            <Form.Group>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                onChange={f.handleChange}
                value={f.values.username}
                placeholder="username"
                name="username"
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
                value={f.values.password}
                placeholder="password"
                name="password"
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
