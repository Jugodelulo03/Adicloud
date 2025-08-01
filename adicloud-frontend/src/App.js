import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AssetsView from "./pages/AssetsView";
import MyRequests from "./pages/MyRequests"; 

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        
        {/* Login page */}
        <Route path="/" element={<LoginPage />} />

        {/* ADMIN */}
        {/* Admin dashboard, protected */}
        <Route
          path="/dashboard/:status?"
          element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />

        {/* USEEER */}
        {/* User dashboard, protected */}
        <Route
          path="/galery"
          element={token && role === 'user' ? <UserDashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/galery/:idAsset"
          element={token && role === 'user' ? <AssetsView /> : <Navigate to="/" />}
        />

        {/* User requests page, protected */}
        <Route
          path="/myrequests/:status?"
          element={token && role === 'user' ? <MyRequests /> : <Navigate to="/" />}
        />
        {/* Catch-all route: redirects any unknown path to login <Route path="*" element={<Navigate to="/" />} /> */}
        
      </Routes>
    </Router>
  );
}

export default App;
