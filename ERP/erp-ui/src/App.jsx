import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* We will add more routes here for Products, Sales, etc. */}

          <Route path="/" element={<Login />} />
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_INVENTORY_MANAGER','ROLE_SALES_EXECUTIVE']}>
            <Layout><Products /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE']}>
              <Layout><Sales /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER', 'ROLE_INVENTORY_MANAGER']}>
              <Layout><Purchases /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER', 'ROLE_INVENTORY_MANAGER']}>
              <Layout><Customers /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/suppliers" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER', 'ROLE_INVENTORY_MANAGER']}>
              <Layout><Suppliers /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;