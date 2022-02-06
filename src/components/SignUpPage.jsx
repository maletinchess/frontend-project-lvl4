import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const SignUpPage = () => {
  const f = useFormik({
    initialValues: {
      password: '',
      login: '',
      passwordConfirm: '',
    },
    onSubmit: (values) => {
      console.log(values);
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
                value={f.values.login}
                placeholder="username"
                name="login"
                id="login"
                autoComplete="login"
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
                autoComplete="password"
                required
              />
              <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Confirm password</Form.Label>
              <Form.Control
                type="password"
                onChange={f.handleChange}
                value={f.values.passwordConfirm}
                placeholder="confirm-password"
                name="passwordConfirmation"
                id="passwordConfirmation"
                autoComplete="confirm-password"
                required
              />
              <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary">Registrate</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
