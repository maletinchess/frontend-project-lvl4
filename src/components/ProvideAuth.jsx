import React from 'react';
import { useProvideAuth } from '../hooks/index.jsx';
import AuthContext from '../contexts/index.jsx';

const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  );
};

export default ProvideAuth;
