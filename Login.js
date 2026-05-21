import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';

const loginStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#0d47a1'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '10px'
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '20px'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none'
  }
};

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await auth.login(formData);
      onLogin(response.data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Неверный логин или пароль');
    }
  };

  return (
    <div style={loginStyles.container} className="fade-in">
      <div style={loginStyles.card}>
        <h2 style={loginStyles.title}>Вход в систему</h2>
        <form style={loginStyles.form} onSubmit={handleSubmit}>
          <div style={loginStyles.inputGroup}>
            <label style={loginStyles.label}>Логин</label>
            <input
              type="text"
              style={loginStyles.input}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div style={loginStyles.inputGroup}>
            <label style={loginStyles.label}>Пароль</label>
            <input
              type="password"
              style={loginStyles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" style={loginStyles.button}>
            Войти
          </button>
          {error && <div style={loginStyles.error}>{error}</div>}
        </form>
        <div style={loginStyles.registerLink}>
          <Link to="/register" style={loginStyles.link}>Еще не зарегистрированы? Регистрация</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;