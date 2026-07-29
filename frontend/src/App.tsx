import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Root Route Redirector */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 2. Isolated Public Login Route - Opens First */}
          <Route path="/login" element={<Login />} />
          {/* 3. Explicit Protected Dashboard Workspace */}
          {/* 3. Protected Dashboard Workspace Wildcard */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <PageLayout theme={theme} setTheme={setTheme} />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Using solid colored tones to match your enterprise theme
      />
      </BrowserRouter>
    </AuthProvider>
  );
}