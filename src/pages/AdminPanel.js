import React, { useState, useEffect } from 'react';
import { applications } from '../services/api';

const adminStyles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  title: {
    color: '#0d47a1',
    marginBottom: '30px'
  },
  filters: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  filterInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    flex: '1'
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px'
  },
  table: {
    width: '100%',
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  th: {
    background: '#007bff',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    cursor: 'pointer'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee'
  },
  select: {
    padding: '6px',
    borderRadius: '6px',
    border: '1px solid #ddd'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px'
  },
  pageButton: {
    padding: '8px 12px',
    border: '1px solid #007bff',
    background: 'white',
    color: '#007bff',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  activePage: {
    background: '#007bff',
    color: 'white'
  }
};

const AdminPanel = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applications.getAll();
      setAllApplications(response.data);
      setFilteredApps(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    let filtered = [...allApplications];
    
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    
    if (filters.search) {
      filtered = filtered.filter(app => 
        app.user_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.transport_type_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [filters, allApplications, sortField, sortDirection]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applications.updateStatus(id, newStatus);
      alert('Статус заявки обновлен!');
      fetchApplications();
    } catch (error) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={adminStyles.container} className="fade-in">
      <h1 style={adminStyles.title}>Панель администратора</h1>
      
      <div style={adminStyles.filters}>
        <input
          type="text"
          style={adminStyles.filterInput}
          placeholder="Поиск по пользователю или транспорту..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          style={adminStyles.filterSelect}
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Все статусы</option>
          <option value="new">Новая</option>
          <option value="in_progress">Идет обучение</option>
          <option value="completed">Обучение завершено</option>
        </select>
      </div>

      <table style={adminStyles.table}>
        <thead>
          <tr>
            <th style={adminStyles.th} onClick={() => handleSort('id')}>ID</th>
            <th style={adminStyles.th} onClick={() => handleSort('user_name')}>Пользователь</th>
            <th style={adminStyles.th} onClick={() => handleSort('transport_type_name')}>Транспорт</th>
            <th style={adminStyles.th} onClick={() => handleSort('start_date')}>Дата начала</th>
            <th style={adminStyles.th} onClick={() => handleSort('payment_method')}>Оплата</th>
            <th style={adminStyles.th} onClick={() => handleSort('status')}>Статус</th>
            <th style={adminStyles.th} onClick={() => handleSort('created_at')}>Дата создания</th>
            <th style={adminStyles.th}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {currentApps.map((app) => (
            <tr key={app.id}>
              <td style={adminStyles.td}>{app.id}</td>
              <td style={adminStyles.td}>{app.user_name}</td>
              <td style={adminStyles.td}>{app.transport_type_name}</td>
              <td style={adminStyles.td}>{app.start_date}</td>
              <td style={adminStyles.td}>{app.payment_method === 'card' ? 'Карта' : app.payment_method === 'cash' ? 'Наличные' : 'Онлайн'}</td>
              <td style={adminStyles.td}>
                <span className={`status-${app.status}`}>
                  {getStatusText(app.status)}
                </span>
              </td>
              <td style={adminStyles.td}>{new Date(app.created_at).toLocaleDateString()}</td>
              <td style={adminStyles.td}>
                <select
                  style={adminStyles.select}
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">Идет обучение</option>
                  <option value="completed">Обучение завершено</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={adminStyles.pagination}>
          <button
            style={adminStyles.pageButton}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            style={adminStyles.pageButton}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              style={{
                ...adminStyles.pageButton,
                ...(currentPage === i + 1 ? adminStyles.activePage : {})
              }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={adminStyles.pageButton}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            style={adminStyles.pageButton}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;