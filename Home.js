import React from 'react';
import ImageSlider from '../components/Slider/ImageSlider';

const homeStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #007bff 0%, #0d47a1 100%)',
    borderRadius: '16px',
    color: 'white',
    marginBottom: '40px'
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '30px'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  featureCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#0d47a1'
  }
};

const Home = () => {
  return (
    <div style={homeStyles.container} className="fade-in">
      <div style={homeStyles.hero}>
        <h1 style={homeStyles.title}>Добро пожаловать на Пассажирам.РФ</h1>
        <p style={homeStyles.subtitle}>
          Профессиональное обучение водителей пассажирским перевозкам
        </p>
        <button className="btn btn-primary">Начать обучение</button>
      </div>

      <ImageSlider />

      <div style={homeStyles.features}>
        <div style={homeStyles.featureCard}>
          <div style={homeStyles.featureIcon}>🚌</div>
          <h3 style={homeStyles.featureTitle}>Обучение на автобус</h3>
          <p>Полный курс подготовки водителей автобусов с получением всех необходимых прав</p>
        </div>
        <div style={homeStyles.featureCard}>
          <div style={homeStyles.featureIcon}>🔋</div>
          <h3 style={homeStyles.featureTitle}>Электробусы</h3>
          <p>Современное обучение на экологичных электробусах с новейшим оборудованием</p>
        </div>
        <div style={homeStyles.featureCard}>
          <div style={homeStyles.featureIcon}>🚋</div>
          <h3 style={homeStyles.featureTitle}>Трамваи</h3>
          <p>Профессиональная подготовка водителей трамваев с опытными инструкторами</p>
        </div>
      </div>
    </div>
  );
};

export default Home;