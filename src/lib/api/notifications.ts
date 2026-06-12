import { Notification } from '../types';

// Standard simulation of notifications since backend has no explicit endpoints listed
// This makes it easy to hook up later once they create notifications tables in backend
let mockNotifications: Notification[] = [];

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    // Return local mock data or localstorage cache for persistence
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app-notifications');
      if (stored) {
        mockNotifications = JSON.parse(stored);
      }
    }
    return Promise.resolve([...mockNotifications]);
  },

  addNotification: async (notification: Omit<Notification, '_id' | 'createdAt' | 'isRead'>): Promise<Notification> => {
    const newNotif: Notification = {
      ...notification,
      _id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    mockNotifications.unshift(newNotif);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-notifications', JSON.stringify(mockNotifications));
    }
    return Promise.resolve(newNotif);
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-notifications', JSON.stringify(mockNotifications));
    }
    return Promise.resolve({ success: true });
  },

  markAsRead: async (id: string): Promise<Notification | null> => {
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
