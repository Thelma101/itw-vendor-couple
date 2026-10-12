/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { notificationsApi, type ServerNotification } from '@/shared/lib/api';
import { useAccount } from '@/shared/contexts/AccountContext';

export interface Notification {
  id: string;
  type: 'booking' | 'message' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  avatar?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking Request',
    message: 'Sarah & Michael have requested to book your services for March 15, 2026',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    link: '/vendor/bookings',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Regina Ugwu: "Thank you for your inquiry! I would love to..."',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    link: '/couple/messages',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received ₦150,000 deposit from Jane & John',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    link: '/vendor/bookings',
  },
  {
    id: '4',
    type: 'review',
    title: 'New Review',
    message: 'Amara & Uche left you a 5-star review!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    link: '/vendor/account',
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Verified',
    message: 'Congratulations! Your vendor profile has been verified.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
  },
];

function fromServer(n: ServerNotification): Notification {
  return {
    id: n.id,
    type: n.type === 'inquiry' ? 'booking' : n.type,
    title: n.title,
    message: n.message,
    timestamp: new Date(n.createdAt),
    read: n.read,
    link: n.link || undefined,
  };
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isDemo, user } = useAccount();
  const [notifications, setNotifications] = useState<Notification[]>(() => (isDemo ? initialNotifications : []));

  useEffect(() => {
    if (isDemo) {
      setNotifications(initialNotifications);
      return;
    }
    if (!user) return;
    let cancelled = false;
    const load = () =>
      notificationsApi
        .list()
        .then((rows) => {
          if (!cancelled) setNotifications(rows.map(fromServer));
        })
        .catch(() => undefined);
    void load();
    const timer = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [isDemo, user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (!isDemo) void notificationsApi.markRead(id).catch(() => undefined);
  }, [isDemo]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!isDemo) void notificationsApi.markAllRead().catch(() => undefined);
  }, [isDemo]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!isDemo) void notificationsApi.remove(id).catch(() => undefined);
  }, [isDemo]);

  const clearAll = useCallback(() => {
    setNotifications((prev) => {
      if (!isDemo) prev.forEach((n) => void notificationsApi.remove(n.id).catch(() => undefined));
      return [];
    });
  }, [isDemo]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
