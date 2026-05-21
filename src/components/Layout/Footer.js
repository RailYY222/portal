import React from 'react';

const footerStyles = {
  footer: {
    background: '#0d47a1',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto'
  }
};

const Footer = () => {
  return (
    <footer style={footerStyles.footer}>
      <p>&copy; 2026 Пассажирам.РФ - Обучение водителей пассажирским перевозкам</p>
    </footer>
  );
};

export default Footer;