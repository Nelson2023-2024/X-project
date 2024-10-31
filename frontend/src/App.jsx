// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/auth/Home/HomePage';
import SignupPage from './pages/auth/Signup/SignupPage';
import LoginPage from './pages/auth/Login/LoginPage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      {/* Common component as it's not part of routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <RightPanel />
    </div>
  );
};

export default App;
