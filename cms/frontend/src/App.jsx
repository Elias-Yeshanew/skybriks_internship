import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Students from './components/students/Students';
import Marks from './components/marks/Marks';
import Fees from './components/fees/Fees';
import Documents from './components/documents/Documents';
import Users from './components/users/Users';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: 10, fontFamily: 'inherit', fontSize: 14 },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute><Layout><Students /></Layout></ProtectedRoute>
          } />
          <Route path="/marks" element={
            <ProtectedRoute><Layout><Marks /></Layout></ProtectedRoute>
          } />
          <Route path="/fees" element={
            <ProtectedRoute><Layout><Fees /></Layout></ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute requiredRole="ADMIN"><Layout><Users /></Layout></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
