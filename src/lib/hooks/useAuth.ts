import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, AuthResponse } from '../api/auth';
import { usersApi } from '../api/users';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout, user, isAuthenticated, isLoading: storeLoading, updateUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);

      // Redirect based on role
      if (data.user.role === 'admin') {
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

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> & { password?: string } }) =>
      usersApi.updateUser(id, data),
    onSuccess: (response: any) => {
      const userObj = response.user || response;
      updateUser(userObj);
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading: storeLoading || loginMutation.isPending || registerMutation.isPending || updateProfileMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    logout: handleLogout,
    error: loginMutation.error || registerMutation.error || updateProfileMutation.error,
  };
}
