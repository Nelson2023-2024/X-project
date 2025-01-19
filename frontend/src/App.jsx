// import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import SignupPage from "./pages/auth/Signup/SignupPage";
import LoginPage from "./pages/auth/Login/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/Notifications/NotificationPage";
import ProfilePage from "./pages/Profile/ProfilePage";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("Authuser:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  console.log("Authuser is here:", authUser);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      {/* Common component as it's not part of routes */}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={'/'} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
};

export default App;
