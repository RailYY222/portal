import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateApplication from './pages/CreateApplication';
import AdminPanel from './pages/AdminPanel.js';
import { auth } from './services/api';
import { getCSRF } from './services/api';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const checkAuth = async () => {
      try {
        const response = await auth.me();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const init = async () => {
      // Получаем CSRF токен
      await getCSRF();
      
      // Проверяем авторизацию
      try {
        const response = await auth.me();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            user ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/profile" /> : <Register onLogin={handleLogin} />
          } />
          <Route path="/profile" element={
            user ? <Profile user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/create-application" element={
            user ? <CreateApplication user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            user && user.username === 'Admin26' ? <AdminPanel /> : <Navigate to="/" />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;