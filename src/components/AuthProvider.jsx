import React, { useState } from 'react';

import routes from '../routes.js';

import authContext from '../contexts/index.jsx';

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(!!userId);

  const getUsername = () => (!userId ? null : userId.username);

  const getAuthHeader = () => (userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {});

  const signin = async (axios, body) => {
    const res = await axios.post(routes.loginPath(), body);
    localStorage.setItem('userId', JSON.stringify(res.data));
    localStorage.setItem('username', res.data.username);
    setLoggedIn(true);
  };

  const signup = async (axios, body) => {
    const res = await axios.post(routes.signupPath(), body);
    localStorage.setItem('userId', JSON.stringify(res.data));
    localStorage.setItem('username', res.data.username);
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn, logOut, getUsername, getAuthHeader, signin, signup,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
