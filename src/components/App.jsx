import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from 'react-router-dom';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import LoginPage from './LoginPage.jsx';
import Home from './Home.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const NoMatch = () => (
  <h3>Error 404</h3>
);

const App = () => {
  const auth = useAuth();
  return (
    <AuthProvider>
      <Router>
        <Link to="/login">Login</Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
export default App;
