import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, AuthResponse } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout, user, isAuthenticated, isLoading: storeLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);

      // Redirect based on role and status
      if (data.user.status === 'pending') {
        router.push('/');
      } else if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      router.push('/waiting-approval');
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading: storeLoading || loginMutation.isPending || registerMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: handleLogout,
    error: loginMutation.error || registerMutation.error,
  };
}
