import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import authContext from '../contexts/index.jsx';
import LoginPage from './LoginPage.jsx';
import Home from './Home.jsx';
import {
  hideModal,
} from '../slices/modalSlice.js';
import getModal from './modals/index.js';

const renderModal = ({ modalInfo, hide }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component onHide={hide} modalInfo={modalInfo} />;
};

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const authPredicate = !userId;
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

const App = () => {
  const dispatch = useDispatch();
  const modalInfo = useSelector((state) => state.modals.modalInfo);

  const handleOnHide = () => {
    dispatch(hideModal());
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <AuthButton />
        </Navbar>
        {renderModal({ modalInfo, hide: handleOnHide })}
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
