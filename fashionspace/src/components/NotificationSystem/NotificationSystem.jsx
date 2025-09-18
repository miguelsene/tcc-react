import { useState, useEffect, createContext, useContext } from 'react';
import './NotificationSystem.css';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
    requestNotificationPermission();
    const autoId = startAutoNotifications();
    return () => clearInterval(autoId);
  }, []);

  const startAutoNotifications = () => {
    const offerNotifications = [
      { title: '🔥 Oferta Especial!', message: 'Desconto de 30% em roupas vintage até meia-noite!', category: 'promotion' },
      { title: '⚡ Flash Sale!', message: 'Liquidação relâmpago: Acessórios com até 50% OFF!', category: 'promotion' },
      { title: '🎯 Oferta Limitada!', message: 'Últimas peças da coleção de inverno com preços imperdíveis!', category: 'promotion' },
      { title: '💎 Promoção VIP!', message: 'Membros premium: Frete grátis + 20% desconto extra!', category: 'promotion' },
      { title: '🛍️ Mega Promoção!', message: 'Compre 2 e leve 3! Válido para toda a loja!', category: 'promotion' },
      { title: '🌟 Novidade!', message: 'Nova coleção primavera-verão chegou! Confira já!', category: 'system' },
      { title: '📦 Entrega Express!', message: 'Entrega no mesmo dia para pedidos até 14h!', category: 'system' }
    ];

    return setInterval(() => {
      const randomOffer = offerNotifications[Math.floor(Math.random() * offerNotifications.length)];
      addNotification({
        ...randomOffer,
        type: 'toast',
        priority: 'medium'
      });
    }, 45000); // 45 segundos
  };

  const loadNotifications = () => {
    const saved = JSON.parse(localStorage.getItem('fashionspace_notifications') || '[]');
    // Não carregar toasts persistidos (toasts são efêmeros)
    const filtered = Array.isArray(saved) ? saved.filter(n => n.type !== 'toast') : [];
    setNotifications(filtered);
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

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      const toPersist = updated.filter(n => n.type !== 'toast');
      localStorage.setItem('fashionspace_notifications', JSON.stringify(toPersist));
      return updated;
    });

    // Push notification
    if (Notification.permission === 'granted' && notification.type === 'toast') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }

    // Auto remove after 6 seconds for toast notifications
    if (notification.type === 'toast') {
      setTimeout(() => removeNotification(newNotification.id), 6000);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const toPersist = updated.filter(n => n.type !== 'toast');
      localStorage.setItem('fashionspace_notifications', JSON.stringify(toPersist));
      return updated;
    });
  };

  const removeNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      const toPersist = updated.filter(n => n.type !== 'toast');
      localStorage.setItem('fashionspace_notifications', JSON.stringify(toPersist));
      return updated;
    });
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
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          className={`toast toast-${notification.priority || 'info'} toast-enter`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="toast-content">
            <div className="toast-icon">
              <i className={getNotificationIcon(notification.category, notification.priority)}></i>
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
          <div className="toast-progress"></div>
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
    review: 'bi-star-fill',
    message: 'bi-chat-dots-fill',
    promotion: 'bi-tag-fill',
    system: 'bi-gear-fill',
    social: 'bi-people-fill'
  };

  const priorityIcons = {
    high: 'bi-exclamation-triangle-fill',
    medium: 'bi-info-circle-fill',
    low: 'bi-check-circle-fill'
  };

  return icons[category] || priorityIcons[priority] || 'bi-bell-fill';
};

export default NotificationCenter;