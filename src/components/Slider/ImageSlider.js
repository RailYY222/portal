import React, { useState, useEffect } from 'react';

const slides = [
    {
      url: "/images/slide1.jpg",
      caption: "Профессиональное обучение водителей автобусов"
    },
    {
      url: "/images/slide2.jpg",
      caption: "Современные электробусы - экологичный транспорт"
    },
    {
      url: "/images/slide3.jpg",
      caption: "Обучение вождению трамвая"
    },
    {
      url: "/images/slide4.png", 
      caption: "Получите права на пассажирские перевозки"
    }
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      maxWidth: '800px',
      margin: '20px auto',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    wrapper: {
      display: 'flex',
      transition: 'transform 0.5s ease-in-out',
      transform: `translateX(-${currentIndex * 100}%)`
    },
    slide: {
      minWidth: '100%',
      position: 'relative'
    },
    image: {
      width: '100%',
      height: '400px',
      objectFit: 'cover'
    },
    caption: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      fontSize: '18px'
    },
    button: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      padding: '12px 18px',
      cursor: 'pointer',
      fontSize: '18px',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    },
    prevButton: {
      left: '10px'
    },
    nextButton: {
      right: '10px'
    },
    dotsContainer: {
      position: 'absolute',
      bottom: '15px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: '10px'
    },
    dot: (active) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      border: 'none',
      background: active ? '#007bff' : 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    })
  };

  // Адаптация для мобильных
  if (window.innerWidth <= 768) {
    styles.image.height = '300px';
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {slides.map((slide, index) => (
          <div key={index} style={styles.slide}>
            <img src={slide.url} alt={`Slide ${index + 1}`} style={styles.image} />
            <div style={styles.caption}>{slide.caption}</div>
          </div>
        ))}
      </div>
      
      <button style={{...styles.button, ...styles.prevButton}} onClick={goToPrev}>
        ‹
      </button>
      <button style={{...styles.button, ...styles.nextButton}} onClick={goToNext}>
        ›
      </button>
      
      <div style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            style={styles.dot(index === currentIndex)}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;