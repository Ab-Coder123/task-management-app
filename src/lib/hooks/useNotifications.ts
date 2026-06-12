import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { useNotificationStore } from '../store/notificationStore';
import { useEffect } from 'react';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { setNotifications, markAsRead: readInStore, markAllAsRead: readAllInStore, notifications, unreadCount } = useNotificationStore();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
  });

  // Sync react query with zustand notification store
  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data);
    }
  }, [notificationsQuery.data, setNotifications]);

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
