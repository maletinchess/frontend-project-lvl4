import React, { useContext, useState, useEffect } from 'react';
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
import {
  hideModal,
} from '../slices/modalSlice.js';
import getModal from './modals/index.js';
import {
  addMessage,
} from '../slices/messageSlice';

import routes from '../routes.js';

import {
  addChannel, removeChannel, renameChannel,
} from '../slices/channelSlice';
// eslint-disable-next-line import/no-webpack-loader-syntax
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

const renderModal = ({ modalInfo, hide, socket }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component onHide={hide} modalInfo={modalInfo} socket={socket} />;
};

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  console.log('auth-prov', userId);
  const [loggedIn, setLoggedIn] = useState(!!userId);

  const getUsername = () => (!userId ? null : userId.username);

  const logIn = () => setLoggedIn(true);

  const signin = async (axios, body) => {
    const res = await axios.post(routes.loginPath(), body);
    console.log(res.data);
    localStorage.setItem('userId', JSON.stringify(res.data));
    localStorage.setItem('username', res.data.username);
    console.log(localStorage);
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn, logIn, logOut, getUsername, signin,
    }}
    >
      {children}
    </authContext.Provider>
  );
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

const runSocket = (socketApi, dispatch) => {
  const mappedAction = {
    newChannel: addChannel,
    newMessage: addMessage,
    removeChannel,
    renameChannel,
  };

  socketApi.on('newChannel', (channel) => {
    dispatch(mappedAction.newChannel(channel));
  });

  socketApi.on('newMessage', (message) => {
    dispatch(mappedAction.newMessage(message));
  });

  socketApi.on('removeChannel', (id) => {
    dispatch(mappedAction.removeChannel(id));
  });

  socketApi.on('renameChannel', (data) => {
    dispatch(mappedAction.renameChannel(data));
  });
};

const App = ({ socket }) => {
  const dispatch = useDispatch();
  const modalInfo = useSelector((state) => state.modals.modalInfo);

  const handleOnHide = () => {
    dispatch(hideModal());
  };

  const { t } = useTranslation();

  useEffect(() => {
    runSocket(socket, dispatch);
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
