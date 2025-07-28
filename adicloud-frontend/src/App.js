import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Main from "./pages/Main"; // User Dashboard
import MyRequests from "./pages/MyRequests"; // Page to show user's requests

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin dashboard, protected */}
        <Route
          path="/admin"
          element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />

        {/* User dashboard, protected */}
        <Route
          path="/user"
          element={token && role === 'user' ? <Main /> : <Navigate to="/" />}
        />

        {/* User requests page, protected */}
        <Route
          path="/user/requests"
          element={token && role === 'user' ? <MyRequests /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
