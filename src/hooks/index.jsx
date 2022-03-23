import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes.js';

import authContext from '../contexts/index.jsx';

const useAuth = () => useContext(authContext);

export const useProvideAuth = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const authPredicate = !userId;
  const [loggedIn, setLoggedIn] = useState(!authPredicate);

  const signin = async (body) => {
    const { data } = await axios.post(routes.loginPath(), body);
    const token = JSON.stringify(data);
    localStorage.setItem('userId', token);
  };

  const signout = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const signup = async (body) => {
    const { data } = await axios.post(routes.signupPath(), body);
    const token = JSON.stringify(data);
    localStorage.setItem('userId', token);
  };

  const getUsername = () => {
    const userDataFromStorage = JSON.parse(localStorage.getItem('userId'));
    if (!userDataFromStorage) {
      return null;
    }
    return userDataFromStorage.username;
  };

  useEffect(() => {

  }, []);

  return {
    signin,
    signout,
    signup,
    loggedIn,
    getUsername,
  };
};

export default useAuth;
