// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SignupPage from './pages/auth/Signup/SignupPage';
import LoginPage from './pages/auth/Login/LoginPage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/Notifications/NotificationPage';
import ProfilePage from './pages/Profile/ProfilePage';

import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      {/* Common component as it's not part of routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
};

export default App;
