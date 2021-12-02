import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from 'react-router-dom';
import authContext from '../contexts/index.jsx';
import LoginPage from './LoginPage.jsx';
import Home from './Home.jsx';

const NoMatch = () => (
  <h3>Error 404</h3>
);

const App = () => (
  <Router>
    <Link to="/login">Login</Link>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  </Router>
);

export default App;
