import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Restaurant from './pages/Restaurant';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/rooms" element={
          <Layout>
            <Rooms />
          </Layout>
        } />
        <Route path="/restaurant" element={
          <Layout>
            <Restaurant />
          </Layout>
        } />
        <Route path="/gallery" element={
          <Layout>
            <Gallery />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to="/admin/dashboard" replace />
          )
        } />
        <Route path="/admin/dashboard" element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/admin" replace />
          )
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;