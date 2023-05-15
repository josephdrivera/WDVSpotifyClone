import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; import Login from './components/Login';
import Callback from './components/Callback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App; 