import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Main from "./pages/Main"; // este es tu UserDashboard

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin"
          element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/user"
          element={token && role === 'user' ? <Main /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
