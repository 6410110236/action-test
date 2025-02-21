import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './layout/Header';
import AppRoutes from './routes/AppRoutes';
import { AuthContext } from './context/Auth.context';

function App() {
  const { isLoggedIn } = useContext(AuthContext).state;

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} />
      <AppRoutes isLoggedIn={isLoggedIn} />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;