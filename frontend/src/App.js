import React, { useContext } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import AppRoutes from './routes/AppRoutes';
import { AuthContext } from './context/Auth.context';

function App() {
  const { state } = useContext(AuthContext);
  const location = useLocation();

  const shouldShowHeader = location.pathname !== '/signin';

  return (
    <div className="App">
      {shouldShowHeader && <Header isLoggedIn={state.isLoggedIn} />}
      <AppRoutes isLoggedIn={state.isLoggedIn} />
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