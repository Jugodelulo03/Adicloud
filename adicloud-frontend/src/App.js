import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard"; // User Dashboard
import MyRequests from "./pages/MyRequests"; // Page to show user's requests

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

        {/* User requests page, protected */}
        <Route
          path="/myrequests"
          element={token && role === 'user' ? <MyRequests /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
