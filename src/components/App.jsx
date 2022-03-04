import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import authContext from '../contexts/index.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import Home from './Home.jsx';
import {
  hideModal,
} from '../slices/modalSlice.js';
import getModal from './modals/index.js';
import {
  addMessage,
} from '../slices/messageSlice';

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
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login">{t('logout')}</Button>
      : null
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
    accessToken: '9671e3800fa04d45be0f1b34555b98d6',
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
                <Link to="/">{t('header')}</Link>
                <AuthButton />
              </Navbar>
              {renderModal({ modalInfo, hide: handleOnHide, socket })}
              <Routes>
                <Route path="/" element={<Home socket={socket} />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </Router>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </ProviderRollbar>
  );
};
export default App;
