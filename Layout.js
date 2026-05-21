import React from 'react';
import Header from './Header';
import Footer from './Footer';

const layoutStyles = {
  main: {
    minHeight: 'calc(100vh - 120px)',
    padding: '40px 0'
  }
};

const Layout = ({ children, user, onLogout }) => {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main style={layoutStyles.main}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;