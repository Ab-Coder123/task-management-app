import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { useNotificationStore } from '../store/notificationStore';
import { useEffect, useRef } from 'react';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { setNotifications, markAsRead: readInStore, markAllAsRead: readAllInStore, notifications, unreadCount } = useNotificationStore();

  const isFirstLoad = useRef(true);

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    refetchInterval: 8000, // Poll every 8 seconds for real-time sound updates!
  });

  // Sync react query with zustand notification store and play sound on new unread notifications
  useEffect(() => {
    if (notificationsQuery.data) {
      const newUnreadCount = notificationsQuery.data.filter((n: any) => !n.isRead).length;
      if (!isFirstLoad.current && newUnreadCount > unreadCount) {
        import('../utils/sound').then(({ playNotificationSound }) => {
          playNotificationSound();
        }).catch((err) => console.error('Failed to play notification sound', err));
      }
      isFirstLoad.current = false;
      setNotifications(notificationsQuery.data);
    }
  }, [notificationsQuery.data, setNotifications, unreadCount]);

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (data) => {
      if (data) {
        readInStore(data._id);
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      readAllInStore();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    markAsRead: markReadMutation.mutateAsync,
    markAllAsRead: markAllReadMutation.mutateAsync,
  };
}
