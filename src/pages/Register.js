import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';

const registerStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#0d47a1'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
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
    marginTop: '10px',
    transition: 'all 0.3s ease'
  },
  error: {
    color: '#dc3545',
    fontSize: '12px',
    fontStyle: 'italic',
    marginTop: '5px'
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none'
  }
};

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_confirm: '',
    email: '',
    first_name: '',
    last_name: '',
    patronymic: '',
    birth_date: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const response = await auth.register(formData);
      onLogin(response.data);
      navigate('/profile');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <div style={registerStyles.container} className="fade-in">
      <div style={registerStyles.card}>
        <h2 style={registerStyles.title}>Регистрация</h2>
        <form style={registerStyles.form} onSubmit={handleSubmit}>
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Логин * (только латиница и цифры, мин. 6 символов)</label>
            <input
              type="text"
              style={registerStyles.input}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            {errors.username && <div style={registerStyles.error}>{errors.username[0]}</div>}
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Пароль * (мин. 8 символов)</label>
            <input
              type="password"
              style={registerStyles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Подтверждение пароля *</label>
            <input
              type="password"
              style={registerStyles.input}
              value={formData.password_confirm}
              onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
              required
            />
            {errors.password && <div style={registerStyles.error}>{errors.password[0]}</div>}
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Email *</label>
            <input
              type="email"
              style={registerStyles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {errors.email && <div style={registerStyles.error}>{errors.email[0]}</div>}
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Фамилия</label>
            <input
              type="text"
              style={registerStyles.input}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Имя</label>
            <input
              type="text"
              style={registerStyles.input}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Отчество</label>
            <input
              type="text"
              style={registerStyles.input}
              value={formData.patronymic}
              onChange={(e) => setFormData({ ...formData, patronymic: e.target.value })}
            />
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Дата рождения</label>
            <input
              type="date"
              style={registerStyles.input}
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>
          
          <div style={registerStyles.inputGroup}>
            <label style={registerStyles.label}>Телефон</label>
            <input
              type="tel"
              style={registerStyles.input}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <button type="submit" style={registerStyles.button}>
            Зарегистрироваться
          </button>
        </form>
        <div style={registerStyles.loginLink}>
          <Link to="/login" style={registerStyles.link}>Уже есть аккаунт? Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;