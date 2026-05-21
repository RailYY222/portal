import React, { useState, useEffect } from 'react';
import { applications, reviews } from '../services/api';
import ImageSlider from '../components/Slider/ImageSlider';

const profileStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  title: {
    color: '#0d47a1',
    marginBottom: '30px'
  },
  userInfo: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  applicationsGrid: {
    display: 'grid',
    gap: '20px'
  },
  applicationCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  reviewForm: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginTop: '20px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontFamily: 'PT Sans, sans-serif',
    fontSize: '16px',
    minHeight: '100px'
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    marginRight: '10px'
  },
  button: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

const Profile = ({ user }) => {
  const [userApplications, setUserApplications] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, reviewsRes] = await Promise.all([
        applications.getAll(),
        reviews.getAll()
      ]);
      setUserApplications(appsRes.data);
      setUserReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) {
      alert('Выберите заявку для отзыва');
      return;
    }

    try {
      await reviews.create({
        application: selectedApp,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      alert('Отзыв успешно добавлен!');
      setSelectedApp(null);
      setReviewData({ rating: 5, comment: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка при добавлении отзыва');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'new': 'Новая',
      'in_progress': 'Идет обучение',
      'completed': 'Обучение завершено'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <div style={profileStyles.container} className="fade-in">
      <h1 style={profileStyles.title}>Личный кабинет</h1>
      
      <div style={profileStyles.userInfo}>
        <h3>Информация о пользователе</h3>
        <p><strong>Логин:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ФИО:</strong> {user.last_name} {user.first_name} {user.patronymic}</p>
        {user.birth_date && <p><strong>Дата рождения:</strong> {user.birth_date}</p>}
        {user.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
      </div>

      <ImageSlider />

      <div style={profileStyles.section}>
        <h2 style={profileStyles.sectionTitle}>Мои заявки</h2>
        <div style={profileStyles.applicationsGrid}>
          {userApplications.length === 0 ? (
            <p>У вас пока нет заявок</p>
          ) : (
            userApplications.map((app) => (
              <div key={app.id} style={profileStyles.applicationCard}>
                <p><strong>Вид транспорта:</strong> {app.transport_type_name}</p>
                <p><strong>Дата начала:</strong> {app.start_date}</p>
                <p><strong>Способ оплаты:</strong> {app.payment_method}</p>
                <p><strong>Статус:</strong> <span className={getStatusClass(app.status)}>{getStatusText(app.status)}</span></p>
                <p><strong>Дата создания:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                {app.status === 'completed' && !userReviews.find(r => r.application === app.id) && (
                  <button 
                    style={profileStyles.button}
                    onClick={() => setSelectedApp(app.id)}
                  >
                    Оставить отзыв
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {selectedApp && (
        <div style={profileStyles.reviewForm}>
          <h3>Оставить отзыв</h3>
          <form onSubmit={handleReviewSubmit}>
            <select 
              style={profileStyles.select}
              value={reviewData.rating}
              onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
            >
              {[5,4,3,2,1].map(r => (
                <option key={r} value={r}>{r} звезд{r === 1 ? 'а' : ''}</option>
              ))}
            </select>
            <textarea
              style={profileStyles.textarea}
              placeholder="Ваш отзыв..."
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              required
            />
            <div>
              <button type="submit" style={profileStyles.button}>Отправить отзыв</button>
              <button 
                type="button" 
                style={{...profileStyles.button, background: '#6c757d', marginLeft: '10px'}}
                onClick={() => setSelectedApp(null)}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;