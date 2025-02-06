import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import About from './pages/About'; 
import Users from './pages/Users'; 
import Header from './layout/Header'; 
import signIn from './pages/signIn';
import signUp from './pages/signUp';


function App() {
  const isLoggedIn = false; 
  
  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<Users />} />
          <Route path="/signin" element={<signIn />} />
          <Route path="/signup" element={<signUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
