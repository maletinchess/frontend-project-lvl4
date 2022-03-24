import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  Button, Navbar, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import authContext from '../contexts/index.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpForm from './SignUp.jsx';
import Home from './Home.jsx';
import AuthProvider from './AuthProvider.jsx';

import {
  hideModal,
} from '../slices/modalSlice.js';
import getModal from './modals/index.js';

import { socketOnApi } from '../socketApi.js';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

const renderModal = ({ modalInfo, hide, socket }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component onHide={hide} modalInfo={modalInfo} socket={socket} />;
};

const NoMatch = () => (
  <h3>Error 404</h3>
);

const AuthButton = () => {
  const auth = useContext(authContext);
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login">{t('logout')}</Button>
      : null
  );
};

const PrivateRoute = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const location = useLocation();
  return (
    userId && userId.token ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = ({ socket }) => {
  const dispatch = useDispatch();
  const modalInfo = useSelector((state) => state.modals.modalInfo);

  const handleOnHide = () => {
    dispatch(hideModal());
  };

  const { t } = useTranslation();

  useEffect(() => {
    socketOnApi(socket, dispatch);
  }, []);

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    environment: 'production',
    captureUncaught: true,
  };

  return (
    <ProviderRollbar config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <div className="d-flex flex-column h-100">
            <Router>
              <Navbar bg="light" expand="lg">
                <Container>
                  <Navbar.Brand as={Link} to="/">{t('header')}</Navbar.Brand>
                  <AuthButton />
                </Container>
              </Navbar>
              <Routes>
                <Route
                  path="/"
                  element={(
                    <PrivateRoute>
                      <Home socket={socket} />
                    </PrivateRoute>
                )}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </Router>
            {renderModal({ modalInfo, hide: handleOnHide, socket })}
            <ToastContainer
              autoClose={5000}
            />
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </ProviderRollbar>
  );
};

export default App;
