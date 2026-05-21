import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const headerStyles = {
  header: {
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'color 0.3s ease'
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'PT Sans, sans-serif'
  }
};

// Адаптация для мобильных
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  headerStyles.nav = {
    ...headerStyles.nav,
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem'
  };
  headerStyles.navLinks = {
    ...headerStyles.navLinks,
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem'
  };
}

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  return (
    <header style={headerStyles.header}>
      <nav style={headerStyles.nav}>
        <Link to="/" style={headerStyles.logo}>
          Пассажирам.РФ
        </Link>
        <div style={headerStyles.navLinks}>
          <Link to="/" style={headerStyles.navLink}>Главная</Link>
          {user ? (
            <>
              <Link to="/profile" style={headerStyles.navLink}>Личный кабинет</Link>
              <Link to="/create-application" style={headerStyles.navLink}>Новая заявка</Link>
              {user.username === 'Admin26' && (
                <Link to="/admin" style={headerStyles.navLink}>Панель администратора</Link>
              )}
              <button onClick={handleLogout} style={headerStyles.logoutButton}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={headerStyles.navLink}>Вход</Link>
              <Link to="/register" style={headerStyles.navLink}>Регистрация</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;