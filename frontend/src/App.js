import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './modules/landing/pages/Home'; 
import Users from './modules/auth/pages/Users'; 
import Header from './layout/Header'; 
import signIn  from './modules/auth/pages/signIn';
import signUp from './modules/auth/pages/signUp';


function App() {
  const isLoggedIn = false; 
  
  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<Users />} />
          <Route path="/signin" element={<signIn />} />
          <Route path="/signup" element={<signUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
