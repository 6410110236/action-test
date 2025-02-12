import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './layout/Header';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <AppRoutes isLoggedIn={isLoggedIn} />
      </div>
    </Router>
  );
}

export default App;
