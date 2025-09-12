import { useState, useEffect, createContext, useContext } from 'react';
import './NotificationSystem.css';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
    requestNotificationPermission();
  }, []);

  const loadNotifications = () => {
    const saved = JSON.parse(localStorage.getItem('fashionspace_notifications') || '[]');
    setNotifications(saved);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('fashionspace_notifications', JSON.stringify(updated));

    // Push notification
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }

    // Auto remove after 5 seconds for toast notifications
    if (notification.type === 'toast') {
      setTimeout(() => removeNotification(newNotification.id), 5000);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('fashionspace_notifications', JSON.stringify(updated));
  };

  const removeNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('fashionspace_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('fashionspace_notifications');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationToasts notifications={notifications.filter(n => n.type === 'toast')} />
    </NotificationContext.Provider>
  );
};

const NotificationToasts = ({ notifications }) => {
  const { removeNotification } = useNotifications();

  return (
    <div className="notification-toasts">
      {notifications.map(notification => (
        <div key={notification.id} className={`toast toast-${notification.priority || 'info'}`}>
          <div className="toast-content">
            <div className="toast-icon">
              <i className={getNotificationIcon(notification.type, notification.priority)}></i>
            </div>
            <div className="toast-text">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
            </div>
            <button 
              className="toast-close"
              onClick={() => removeNotification(notification.id)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const NotificationCenter = () => {
  const { notifications, markAsRead, removeNotification, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h3>
          <i className="bi bi-bell"></i>
          Notificações
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </h3>
        <div className="notification-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="unread">Não lidas</option>
            <option value="read">Lidas</option>
          </select>
          <button className="btn btn-secondary" onClick={clearAll}>
            Limpar Todas
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bell-slash"></i>
            <p>Nenhuma notificação encontrada</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
            />
          ))
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, onRemove }) => {
  return (
    <div className={`notification-item ${!notification.read ? 'unread' : ''}`}>
      <div className="notification-icon">
        <i className={getNotificationIcon(notification.category, notification.priority)}></i>
      </div>
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        <span className="timestamp">
          {new Date(notification.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="notification-actions">
        {!notification.read && (
          <button 
            className="btn-icon"
            onClick={() => onMarkAsRead(notification.id)}
            title="Marcar como lida"
          >
            <i className="bi bi-check"></i>
          </button>
        )}
        <button 
          className="btn-icon"
          onClick={() => onRemove(notification.id)}
          title="Remover"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
};

const getNotificationIcon = (category, priority) => {
  const icons = {
    review: 'bi-star',
    message: 'bi-chat-dots',
    promotion: 'bi-tag',
    system: 'bi-gear',
    social: 'bi-people'
  };

  const priorityIcons = {
    high: 'bi-exclamation-triangle',
    medium: 'bi-info-circle',
    low: 'bi-check-circle'
  };

  return icons[category] || priorityIcons[priority] || 'bi-bell';
};

export default NotificationCenter;