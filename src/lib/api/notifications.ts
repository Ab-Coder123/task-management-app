import { Notification } from '../types';
import { playNotificationSound } from '../utils/sound';
import { apiFetch } from './base';

const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

// Helper to filter notifications to only those created within the last 48 hours (2 days)
function filterRecentNotifications(notifs: Notification[]): Notification[] {
  const now = Date.now();
  return notifs.filter((n) => {
    if (!n.createdAt) return false;
    const time = new Date(n.createdAt).getTime();
    return !isNaN(time) && (now - time) <= TWO_DAYS_MS;
  });
}

// Local fallback cache
let mockNotifications: Notification[] = [];

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      // 1. Try fetching directly from our real MongoDB backend server (which actively deletes older than 48h)
      const serverNotifs = await apiFetch<Notification[]>('/api/notifications/getnotifications', { method: 'GET' });
      if (Array.isArray(serverNotifs)) {
        const valid = filterRecentNotifications(serverNotifs);
        if (typeof window !== 'undefined') {
          localStorage.setItem('app-notifications', JSON.stringify(valid));
        }
        mockNotifications = valid;
        return valid;
      }
    } catch (err) {
      console.warn('Backend notifications endpoint unreachable, using local fallback cache:', err);
    }

    // 2. Fallback to localStorage and prune old (>48h) notifications
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app-notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          mockNotifications = filterRecentNotifications(parsed);
          localStorage.setItem('app-notifications', JSON.stringify(mockNotifications));
        } catch (e) {
          console.error('Error parsing local notifications', e);
        }
      }
    }
    return Promise.resolve([...mockNotifications]);
  },

  addNotification: async (notification: Omit<Notification, '_id' | 'createdAt' | 'isRead'>): Promise<Notification> => {
    try {
      // 1. Send to backend server
      const serverSaved = await apiFetch<Notification>('/api/notifications/addnotification', {
        method: 'POST',
        bodyData: notification,
      });
      if (serverSaved && serverSaved._id) {
        if (typeof window !== 'undefined') {
          playNotificationSound();
        }
        return serverSaved;
      }
    } catch (err) {
      console.warn('Backend add notification failed, using local fallback:', err);
    }

    // 2. Fallback
    const newNotif: Notification = {
      ...notification,
      _id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    mockNotifications.unshift(newNotif);
    mockNotifications = filterRecentNotifications(mockNotifications);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-notifications', JSON.stringify(mockNotifications));
      playNotificationSound();
    }
    return Promise.resolve(newNotif);
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    try {
      await apiFetch('/api/notifications/markallread', { method: 'PUT' });
    } catch (err) {
      console.warn('Backend markAllAsRead failed:', err);
    }
    mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-notifications', JSON.stringify(mockNotifications));
    }
    return Promise.resolve({ success: true });
  },

  markAsRead: async (id: string): Promise<Notification | null> => {
    try {
      const updated = await apiFetch<Notification>(`/api/notifications/markread_id=${id}`, { method: 'PUT' });
      if (updated && updated._id) {
        return updated;
      }
    } catch (err) {
      console.warn('Backend markAsRead failed:', err);
    }
    let found: Notification | null = null;
    mockNotifications = mockNotifications.map((n) => {
      if (n._id === id) {
        found = { ...n, isRead: true };
        return found;
      }
      return n;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-notifications', JSON.stringify(mockNotifications));
    }
    return Promise.resolve(found);
  },
};
