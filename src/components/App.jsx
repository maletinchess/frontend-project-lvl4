import React, { useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import LoginPage from './LoginPage.jsx';
import Home from './Home.jsx';

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const authPredicate = !userId;
  console.log(!authPredicate);
  const [loggedIn, setLoggedIn] = useState(!authPredicate);

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

const AuthButton = () => {
  const auth = useContext(authContext);

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login">Log out</Button>
      : <Button as={Link} to="/login">Log in</Button>
  );
};

const AuthRouter = () => {
  const auth = useAuth();
  const authPath = auth.loggedIn ? '/' : '/login';
  const redirectElem = auth.loggedIn ? <Home /> : <LoginPage />;
  return (
    <Route path={authPath} element={redirectElem} />
  );
};

const App = () => {
  const auth = useAuth();
  console.log(auth);
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <AuthButton />
        </Navbar>
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
