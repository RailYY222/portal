import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transport, applications } from '../services/api';

const createStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 20px'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#0d47a1',
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
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
  select: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white'
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
  message: {
    padding: '10px',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'center'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  }
};

const CreateApplication = ({ user }) => {
  const navigate = useNavigate();
  const [transportTypes, setTransportTypes] = useState([]);
  const [formData, setFormData] = useState({
    transport_type: '',
    start_date: '',
    payment_method: 'card'
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransportTypes();
  }, []);

  const fetchTransportTypes = async () => {
    try {
      const response = await transport.getAll();
      setTransportTypes(response.data);
    } catch (error) {
      console.error('Error fetching transport types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await applications.create(formData);
      setMessage({ text: 'Заявка успешно создана!', type: 'success' });
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.error || 'Ошибка при создании заявки', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={createStyles.container} className="fade-in">
      <div style={createStyles.card}>
        <h2 style={createStyles.title}>Новая заявка на обучение</h2>
        <form style={createStyles.form} onSubmit={handleSubmit}>
          <div style={createStyles.inputGroup}>
            <label style={createStyles.label}>Вид транспорта *</label>
            <select
              style={createStyles.select}
              value={formData.transport_type}
              onChange={(e) => setFormData({ ...formData, transport_type: e.target.value })}
              required
            >
              <option value="">Выберите вид транспорта</option>
              {transportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div style={createStyles.inputGroup}>
            <label style={createStyles.label}>Дата начала обучения *</label>
            <input
              type="date"
              style={createStyles.input}
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={createStyles.inputGroup}>
            <label style={createStyles.label}>Способ оплаты *</label>
            <select
              style={createStyles.select}
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            >
              <option value="card">Банковская карта</option>
              <option value="cash">Наличные</option>
              <option value="online">Онлайн оплата</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={createStyles.button}
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>

          {message.text && (
            <div style={{
              ...createStyles.message,
              ...(message.type === 'success' ? createStyles.success : createStyles.error)
            }}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateApplication;